// vlasky:mysql
// MIT License, github@vladlasky.com, ben@latenightsketches.com, wj32.64@gmail.com
// lib/LiveMysql.js
import LiveMysql from '@vlasky/mysql-live-select';
import { LiveMysqlKeySelector } from '@vlasky/mysql-live-select';

// Helper to process diffs and send updates to subscription
const processDiff = (diff, sub) => {
  if (diff.removed) {
    for (const rowKey of Object.keys(diff.removed)) {
      sub.removed(sub._name, rowKey);
    }
  }
  if (diff.added) {
    for (const [rowKey, row] of Object.entries(diff.added)) {
      sub.added(sub._name, rowKey, row);
    }
  }
  if (diff.changed) {
    for (const [rowKey, fields] of Object.entries(diff.changed)) {
      sub.changed(sub._name, rowKey, fields);
    }
  }
};

// Convert the LiveMysqlSelect object into a cursor for Meteor.publish()
LiveMysql.LiveMysqlSelect.prototype._publishCursor = async function(sub) {
  return new Promise((resolve, reject) => {
    sub.onStop(() => this.stop());

    this.on('update', (diff) => {
      try {
        processDiff(diff, sub);
      } catch (e) {
        // Silently handle errors to avoid crashing the application
      }

      if (sub._ready === false) {
        resolve();
      }
    });

    this.on('error', (error) => reject(error));
  });
};

export { LiveMysql, LiveMysqlKeySelector };
