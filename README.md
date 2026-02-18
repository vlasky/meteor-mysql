# vlasky:mysql
Reactive MySQL for Meteor

Provides Meteor integration of the [`mysql-live-select` NPM module](https://github.com/vlasky/mysql-live-select), bringing reactive `SELECT` statement result sets from MySQL >= 5.1.15.

NOTE: The version of mysql-live-select used by this package differs from numtel's original package in that result sets are treated as dictionaries rather than arrays. In this version, the identity of each row is determined by a `LiveMysqlKeySelector` that is passed into the `select` function.

NOTE: The version of mysql-live-select used by this package differs from wj32's forked package in that MySQL prepared statements are used instead of normal queries, for improved performance.

`MysqlSubscription` has been removed. To subscribe to a `LiveMysqlSelect` publication, use `Meteor.subscribe()`.

For more information, see the original [`numtel:mysql` package](https://github.com/numtel/meteor-mysql).

## Server Implements

This package provides the `LiveMysql` class as defined in the [`mysql-live-select` NPM package](https://github.com/vlasky/mysql-live-select). Be sure to follow the installation instructions for configuring your MySQL server to output the binary log.

The `LiveMysql.select()` method is used exclusively for creating reactive queries. For conventional MySQL operations, a [`mysql2`](https://github.com/sidorares/node-mysql2) promise-based connection pool is exposed via the `LiveMysql.poolPromise` property (preferred for use with async/await). A callback-based connection pool is also available via `LiveMysql.pool`, or a single connection via `LiveMysql.db`.

### `LiveMysql.prototype.select()`

In this Meteor package, the `LiveMysqlSelect` object returned by the `select()` method is modified to act as a cursor that can be published.

```javascript
import { LiveMysql, LiveMysqlKeySelector } from 'meteor/vlasky:mysql';

var liveDb = new LiveMysql(Meteor.settings.mysql);

Meteor.publish('allPlayers', async function() {
  return liveDb.select(
    `SELECT * FROM players ORDER BY score DESC`,
    null,
    LiveMysqlKeySelector.Index(),
    [ { table: 'players' } ]
  );
});
```

## Tests / Benchmarks

A MySQL server configured to output the binary log in row mode is required to run the test suite.

The MySQL connection settings must be configured in `test/settings/local.json`.

The database specified should be an empty database with no tables because the tests will create and delete tables as needed.

If you set the `recreateDb` value to true, the test suite will automatically create the database, allowing you to specify a database name that does not yet exist.

```bash
# Install Meteor
$ curl -L https://install.meteor.com/ | /bin/sh

# Clone Repository
$ git clone https://github.com/vlasky/meteor-mysql.git
$ cd meteor-mysql

# Configure database settings in your favorite editor
# (an empty database is suggested)
$ ed test/settings/local.json

# Run test/benchmark server
$ meteor test-packages --settings test/settings/local.json ./

```

## License

MIT
