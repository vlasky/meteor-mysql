Package.describe({
  name: 'vlasky:mysql',
  summary: 'MySQL support with Reactive Select Subscriptions',
  version: '1.2.11',
  git: 'https://github.com/vlasky/meteor-mysql.git'
});

Npm.depends({
  'lodash': '4.17.15',
  'mysql': 'git://github.com/mysqljs/mysql.git#compression',
  'mysql2': '2.1.0',
  'mysql-live-select': 'git://github.com/vlasky/mysql-live-select.git#834d1f676b09f133774872b2d4d083fd59313010'
});

Package.onUse(function(api) {
  api.versionsFrom(['1.3', '1.4']);
  api.use([
    'ecmascript',
    'ddp',
    'tracker'
  ]);

  api.mainModule('lib/LiveMysql.js', 'server');
  api.export('LiveMysql', 'server');
});

Package.onTest(function(api) {
  api.use([
    'tinytest',
    'ecmascript',
    'templating',
    'underscore',
    'autopublish',
    'insecure',
    'http',
    'simple:rest@0.2.3',
    'vlasky:mysql',
  ]);
  api.use('test-helpers'); // Did not work concatenated above
  api.addFiles([
    'test/helpers/expectResult.js',
    'test/helpers/randomString.js'
  ]);

  api.addFiles([
    'test/fixtures/tpl.html',
    'test/fixtures/tpl.js'
  ], 'client');

  api.addFiles([
    'test/helpers/queryEx.js',
    'test/helpers/querySequence.js',
  ], 'server');

  api.addAssets([
    'test/index.es6'
  ], 'server');

  api.addFiles([
    'test/MysqlSubscription.js',
//     'test/simple_rest.js'
  ]);
});
