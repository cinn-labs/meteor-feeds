Package.describe({
  name: 'cinn:feeds',
  version: '0.3.3',
  summary: 'Feeds collection and generator helpers for social networks or any events handler',
  git: 'https://github.com/cinn-labs/meteor-feeds',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  const both = ['client', 'server'];
  api.versionsFrom('1.3.4');
  api.export('Feeds');
  api.export('FeedsHandler');
  api.export('FeedsComponents');

  api.use('meteor-base');
  api.use('ecmascript');
  api.use("matb33:collection-hooks@0.8.1");

  api.addFiles('feeds.components.js', 'client');
  api.addFiles('feeds.collections.js', both);
  api.addFiles('feeds.handler.js', both);
  api.addFiles('feeds.handler.server.js', 'server');
});
