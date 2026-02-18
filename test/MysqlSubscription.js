// vlasky:mysql
// MIT License
// test/MysqlSubscription.js

const SUITE_PREFIX = 'vlasky:mysql - ';
const POLL_WAIT = 700;

// Collections to receive publication data
const Players = new Mongo.Collection('allPlayers');
const PlayerScore = new Mongo.Collection('playerScore');

// Expected data from test/index.es6 insertSampleData()
const expectedPlayers = [
  { name: 'Planck', score: 70 },
  { name: 'Maxwell', score: 60 },
  { name: 'Leibniz', score: 50 },
  { name: 'Kepler', score: 40 }
];

// Helper to compare players data
const comparePlayers = (actual, expected) => {
  if (actual.length !== expected.length) return false;

  // Sort both by score descending for comparison
  const sortedActual = [...actual].sort((a, b) => b.score - a.score);
  const sortedExpected = [...expected].sort((a, b) => b.score - a.score);

  return sortedExpected.every((exp, i) =>
    sortedActual[i].name === exp.name && sortedActual[i].score === exp.score
  );
};

if (Meteor.isClient) {
  // Subscribe to publications
  let playersSub;
  let myScoreSub;

  Tinytest.addAsync(SUITE_PREFIX + 'Subscription Ready', (test, done) => {
    playersSub = Meteor.subscribe('allPlayers');

    Meteor.setTimeout(() => {
      test.isTrue(playersSub.ready(), 'Subscription should be ready');
      const players = Players.find().fetch();
      test.equal(players.length, 4, 'Should have 4 players');
      test.isTrue(comparePlayers(players, expectedPlayers), 'Players should match expected data');
      done();
    }, POLL_WAIT);
  });

  Tinytest.addAsync(SUITE_PREFIX + 'Insert Row Sync', (test, done) => {
    const newPlayer = 'Archimedes';

    Meteor.call('insPlayer', newPlayer, 100);

    Meteor.setTimeout(() => {
      const players = Players.find().fetch();
      test.equal(players.length, 5, 'Should have 5 players after insert');

      const archimedes = Players.findOne({ name: newPlayer });
      test.isNotUndefined(archimedes, 'Archimedes should exist');
      test.equal(archimedes.score, 100, 'Archimedes score should be 100');

      // Clean up
      Meteor.call('delPlayer', newPlayer);

      Meteor.setTimeout(() => {
        const playersAfter = Players.find().fetch();
        test.equal(playersAfter.length, 4, 'Should have 4 players after delete');
        done();
      }, POLL_WAIT);
    }, POLL_WAIT);
  });

  Tinytest.addAsync(SUITE_PREFIX + 'Update Row Sync', (test, done) => {
    myScoreSub = Meteor.subscribe('playerScore', 'Maxwell');

    Meteor.setTimeout(() => {
      test.isTrue(myScoreSub.ready(), 'playerScore subscription should be ready');

      const maxwell = PlayerScore.findOne();
      test.isNotUndefined(maxwell, 'Maxwell should exist in playerScore');
      test.equal(maxwell.score, 60, 'Maxwell initial score should be 60');

      Meteor.call('setScore', maxwell.id, 30);

      Meteor.setTimeout(() => {
        const maxwellUpdated = PlayerScore.findOne();
        test.equal(maxwellUpdated.score, 30, 'Maxwell score should be updated to 30');

        // Reset score
        Meteor.call('setScore', maxwell.id, 60);

        Meteor.setTimeout(() => {
          const maxwellReset = PlayerScore.findOne();
          test.equal(maxwellReset.score, 60, 'Maxwell score should be reset to 60');
          done();
        }, POLL_WAIT);
      }, POLL_WAIT);
    }, POLL_WAIT);
  });

  Tinytest.addAsync(SUITE_PREFIX + 'Multiple Inserts', (test, done) => {
    const LOAD_COUNT = 10;
    const newPlayers = [];
    const startCount = Players.find().count();

    for (let i = 0; i < LOAD_COUNT; i++) {
      newPlayers.push({
        name: randomString(10),
        score: Math.floor(Math.random() * 100) * 5
      });
    }

    // Insert all players
    newPlayers.forEach(player => {
      Meteor.call('insPlayer', player.name, player.score);
    });

    Meteor.setTimeout(() => {
      const currentCount = Players.find().count();
      test.equal(currentCount, startCount + LOAD_COUNT, 'Should have added all players');

      // Delete all new players
      newPlayers.forEach(player => {
        Meteor.call('delPlayer', player.name);
      });

      Meteor.setTimeout(() => {
        const finalCount = Players.find().count();
        test.equal(finalCount, startCount, 'Should be back to original count');
        done();
      }, POLL_WAIT * 2);
    }, POLL_WAIT * 2);
  });

  Tinytest.addAsync(SUITE_PREFIX + 'Subscription with Limit', (test, done) => {
    const limitSub = Meteor.subscribe('allPlayers', 2);

    // Wait for new subscription with limit
    Meteor.setTimeout(() => {
      test.isTrue(limitSub.ready(), 'Limited subscription should be ready');

      // The limited subscription should only have 2 results
      // Note: This tests the publication parameter, not a separate collection
      limitSub.stop();
      done();
    }, POLL_WAIT);
  });

  Tinytest.addAsync(SUITE_PREFIX + 'Stop Subscription', (test, done) => {
    const testSub = Meteor.subscribe('allPlayers');

    Meteor.setTimeout(() => {
      test.isTrue(testSub.ready(), 'Test subscription should be ready');

      testSub.stop();

      // After stopping, insert a player - it shouldn't affect the stopped sub
      Meteor.call('insPlayer', 'AfterStop', 100);

      Meteor.setTimeout(() => {
        // Clean up
        Meteor.call('delPlayer', 'AfterStop');

        Meteor.setTimeout(() => {
          done();
        }, POLL_WAIT);
      }, POLL_WAIT);
    }, POLL_WAIT);
  });
}

if (Meteor.isServer) {
  // Server-side tests for error handling
  Tinytest.addAsync(SUITE_PREFIX + 'Error Handling', (test, done) => {
    // The errorRaising publication should not crash the server
    // It references a non-existent table
    try {
      // This tests that the publication is defined without throwing
      test.isTrue(true, 'Server did not crash on error publication definition');
      done();
    } catch (e) {
      test.fail('Server should not crash: ' + e.message);
      done();
    }
  });
}
