// vlasky:mysql
// MIT License
// test/index.js

import { LiveMysql, LiveMysqlKeySelector } from 'meteor/vlasky:mysql';

// Configure database
const database = Meteor.settings.mysql.database;
if (Meteor.settings.recreateDb) {
  delete Meteor.settings.mysql.database;
}

const liveDb = new LiveMysql(Meteor.settings.mysql);

// Make liveDb available globally for tests
global.liveDb = liveDb;

// Helper for single queries
const query = async (sql, params = []) => {
  const [rows] = await liveDb.poolpromise.execute(sql, params);
  return rows;
};

const init = async () => {
  if (Meteor.settings.recreateDb) {
    // Can't use parameterized queries for database names
    await liveDb.poolpromise.query(`DROP DATABASE IF EXISTS \`${database}\``);
    await liveDb.poolpromise.query(`CREATE DATABASE \`${database}\``);
    await liveDb.poolpromise.query(`USE \`${database}\``);
  }

  await insertSampleData();

  Meteor.publish('errorRaising', function() {
    return liveDb.select(
      'SELECT * FROM this_will_cause_an_exception ORDER BY score DESC',
      [],
      LiveMysqlKeySelector.Index(),
      [{ database, table: 'this_will_cause_an_exception' }]
    );
  });

  Meteor.publish('allPlayers', function(limit) {
    if (Number.isInteger(limit)) {
      return liveDb.select(
        'SELECT * FROM players ORDER BY score DESC LIMIT ?',
        [limit.toString()],
        LiveMysqlKeySelector.Columns(['id']),
        [{ database, table: 'players' }]
      );
    }
    return liveDb.select(
      'SELECT * FROM players ORDER BY score DESC',
      [],
      LiveMysqlKeySelector.Columns(['id']),
      [{ database, table: 'players' }]
    );
  });

  Meteor.publish('playerScore', function(name) {
    return liveDb.select(
      'SELECT id, score FROM players WHERE name = ?',
      [name],
      LiveMysqlKeySelector.Columns(['id']),
      [
        {
          database,
          table: 'players',
          condition: (row, newRow) => row.name === name
        }
      ]
    );
  });

  Meteor.methods({
    async setScore(id, value) {
      return query('UPDATE players SET score = ? WHERE id = ?', [value, id]);
    },
    async insPlayer(name, score) {
      return query('INSERT INTO players (name, score) VALUES (?, ?)', [name, score]);
    },
    async delPlayer(name) {
      return query('DELETE FROM players WHERE name = ?', [name]);
    },
  });
};

const insertSampleData = async () => {
  await query('DROP TABLE IF EXISTS players');
  await query(`CREATE TABLE players (
    id int(11) NOT NULL AUTO_INCREMENT,
    name varchar(45) DEFAULT NULL,
    score int(11) NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  await query(
    'INSERT INTO players (name, score) VALUES (?, ?), (?, ?), (?, ?), (?, ?)',
    ['Kepler', 40, 'Leibniz', 50, 'Maxwell', 60, 'Planck', 70]
  );
};

init();
