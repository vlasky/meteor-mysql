// vlasky:mysql
// MIT License, github@vladlasky.com, ben@latenightsketches.com, wj32.64@gmail.com
// lib/LiveMysql.js
const LiveMysql = Npm.require('@vlasky/mysql-live-select');
const LiveMysqlKeySelector = Npm.require('@vlasky/mysql-live-select/lib/LiveMysqlKeySelector');

const _ = Npm.require('lodash');

// Convert the LiveMysqlSelect object into a cursor
if (Meteor.isFibersDisabled) {
  LiveMysql.LiveMysqlSelect.prototype._publishCursor = async function(sub) {
    const self = this;

    return new Promise((resolve, reject) => {
      sub.onStop(function() {
        self.stop();
      });

      // Send aggregation of differences
      self.on('update', function(diff, data) {
        try {
          if (diff.removed) {
            _.each(diff.removed, function(dummy, rowKey) {
              sub.removed(sub._name, rowKey);
            });
          }
          if (diff.added) {
            _.each(diff.added, function(row, rowKey) {
              sub.added(sub._name, rowKey, row);
            });
          }
          if (diff.changed) {
            _.each(diff.changed, function(fields, rowKey) {
              sub.changed(sub._name, rowKey, fields);
            });
          }
        } catch (e) {
          // Future versions may add special handling code
          // At the moment, we are happy simply to not crash the application
        }

        if (sub._ready === false) {
          resolve();
        }
      });

      // Do not crash application on publication error
      self.on('error', function(error) {
        reject(error);
      });
    });
  }
} else {
  const Future = Npm.require('fibers/future');

  LiveMysql.LiveMysqlSelect.prototype._publishCursor = function(sub) {
    const self = this;
    const fut = new Future;

    sub.onStop(function() {
      self.stop();
    });

    // Send aggregation of differences
    self.on('update', function(diff, data) {
      try
      {
          if (diff.removed) {
            _.each(diff.removed, function(dummy, rowKey) {
              sub.removed(sub._name, rowKey);
            });
          }
          if (diff.added) {
            _.each(diff.added, function(row, rowKey) {
              sub.added(sub._name, rowKey, row);
            });
          }
          if (diff.changed) {
            _.each(diff.changed, function(fields, rowKey) {
              sub.changed(sub._name, rowKey, fields);
            });
          }
      }
      catch (e)
      {
          // Future versions may add special handling code
          // At the moment, we are happy simply to not crash the application
      }

      if (sub._ready === false && !fut.isResolved()) {
        fut.return();
      }
    });

    // Do not crash application on publication error
    self.on('error', function(error) {
      if (!fut.isResolved()) {
        fut.throw(error);
      }
    });

    return fut.wait();
  }
}

// Support for simple:rest

// Result set data does not exist in a Mongo Collection, provide generic name
LiveMysql.LiveMysqlSelect.prototype._cursorDescription = { collectionName: 'data' };

LiveMysql.LiveMysqlSelect.prototype.fetch = function() {
  // HttpSubscription object requires _id field for added() method
  const self = this;
  const dataWithIds = Object.keys(self.queryCache.data).map(function(rowKey, index) {
    const clonedRow = _.clone(self.queryCache.data[rowKey]);
    if (!('_id' in clonedRow)) {
      clonedRow._id = rowKey;
    }

    // Ensure row index is included since response will not be ordered
    if (!('_index' in clonedRow)) {
      clonedRow._index = index + 1;
    }

    return clonedRow;
  });

  return dataWithIds;
}

export { LiveMysql, LiveMysqlKeySelector };
