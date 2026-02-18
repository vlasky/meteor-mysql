Package.describe({
  name: 'vlasky:mysql',
  summary: 'MySQL support with Reactive Select Subscriptions',
  version: '1.4.0',
  git: 'https://github.com/vlasky/meteor-mysql.git',
  types: 'index.d.ts'
});

Npm.depends({
  '@vlasky/mysql-live-select': '1.3.0'
});

Package.onUse(function(api) {
  api.versionsFrom('3.0');
  api.use([
    'ecmascript',
    'ddp'
  ]);

  api.mainModule('lib/LiveMysql.js', 'server');

  api.addAssets('index.d.ts', ['client', 'server']);

});

Package.onTest(function(api) {
  api.use([
    'tinytest',
    'ecmascript',
    'mongo',
    'tracker',
    'vlasky:mysql',
  ]);
  api.use('test-helpers');

  api.addFiles('test/helpers/randomString.js', 'client');

  api.addFiles('test/index.js', 'server');

  api.addFiles('test/MysqlSubscription.js');
});
