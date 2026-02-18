# Changelog

## 1.4.0 (2026-02-18)

- **Breaking:** Requires Meteor 3.0+
- Now using mysql-live-select 1.3.0
- Async/await and ESM imports throughout
- Added TypeScript type definitions
- Removed Fibers/Meteor 1.x/2.x support
- Removed long-unmaintained simple:rest support.

## 1.3.0 (2024-08-26)

- Added Meteor 3.0 support (while retaining Meteor 1.x/2.x compatibility)

## 1.2.28 (2024-08-23)

- Reverted to mysql-live-select 1.2.26 due to minor breaking change in 1.2.27

## 1.2.27 (2024-08-21)

- Updated to mysql-live-select 1.2.27

## 1.2.26 (2023-02-03)

- Updated to mysql-live-select 1.2.26

## 1.2.25 (2022-02-17)

- Updated to mysql-live-select 1.2.25

## 1.2.23 (2021-11-06)

- Updated to mysql-live-select 1.2.23

## 1.2.22 (2021-10-19)

- Updated to mysql-live-select 1.2.22

## 1.2.21 (2021-04-30)

- Updated to mysql-live-select 1.2.21

## 1.2.19 (2021-04-17)

- Updated to mysql-live-select 1.2.19

## 1.2.18 (2021-04-17)

- Updated to mysql-live-select 1.2.18

## 1.2.17 (2021-03-25)

- Updated to mysql-live-select 1.2.17

## 1.2.16 (2021-03-21)

- Updated to mysql-live-select 1.2.16

## 1.2.14 (2021-03-08)

- Updated to mysql-live-select 1.2.14

## 1.2.12 (2020-04-30)

- Fixed error when using package from a fresh Meteor project

## 1.2.11 (2020-01-03)

- Updated to node-mysql2 2.1.0

## 1.2.9 (2019-11-12)

- Updated mysql-live-select dependency

## 1.2.8 (2019-11-12)

- Updated mysql-live-select dependency

## 1.2.7 (2019-02-22)

- Updated mysql to 2.16.0

## 1.2.4 (2016-11-15)

- Updated node-mysql, node-mysql2, mysql-live-select and lodash

## 1.2.2 (2016-10-08)

- Updated node-mysql2 to 1.1.1

## 1.2.0 (2016-06-17)

- vlasky:mysql - forked from wj32:mysql
- MySQL prepared statements used instead of normal queries for improved performance (via mysql-live-select 1.2.0)
- Switched from underscore to lodash
- Updated node-mysql and node-mysql2 dependencies

## 1.1.0 (2015-12-21)

- wj32:mysql - forked from numtel:mysql package
- Result sets treated as dictionaries (keyed by `LiveMysqlKeySelector`) instead of arrays
