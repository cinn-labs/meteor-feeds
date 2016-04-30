Package.describe({
  name: 'cinn:feeds',
  version: '0.0.1',
  summary: 'Feeds collection and generator helpers for social networks or any events handler',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  const both = ['client', 'server'];
  api.versionsFrom('1.3.2.4');
  api.export('Feeds');
  api.export('FeedsHandler');

  api.use('meteor-base');
  api.use('ecmascript');
  api.use("matb33:collection-hooks@0.7.15");

  api.addFiles('feeds.collections.js', both);
  api.addFiles('feeds.handler.js', both);
  api.addFiles('feeds.handler.server.js', 'server');
});
