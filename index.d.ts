// Type definitions for vlasky:mysql
// Project: https://github.com/vlasky/meteor-mysql

import {
  LiveMysql as BaseLiveMysql,
  LiveMysqlKeySelector,
  LiveMysqlSelect,
  RowData,
  DataDictionary,
  Diff,
  Trigger,
  KeySelector,
  KeyFunction,
  DataSourceSettings,
  PoolDataSourceSettings,
  QueryCache,
  TableCache,
} from '@vlasky/mysql-live-select';

declare module '@vlasky/mysql-live-select' {
  interface LiveMysqlSelect<T extends RowData = RowData> {
    /**
     * Publish this live select as a Meteor publication cursor
     * @param sub - Meteor subscription object
     * @internal
     */
    _publishCursor(sub: Subscription): Promise<void>;
  }
}

/** Meteor subscription object passed to _publishCursor */
interface Subscription {
  _name: string;
  _ready: boolean;
  onStop(callback: () => void): void;
  added(collection: string, id: string, fields: RowData): void;
  changed(collection: string, id: string, fields: Partial<RowData>): void;
  removed(collection: string, id: string): void;
}

export {
  BaseLiveMysql as LiveMysql,
  LiveMysqlKeySelector,
  LiveMysqlSelect,
  RowData,
  DataDictionary,
  Diff,
  Trigger,
  KeySelector,
  KeyFunction,
  DataSourceSettings,
  PoolDataSourceSettings,
  QueryCache,
  TableCache,
};
