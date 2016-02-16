Package.describe({
  name: 'liberation:subscription-audit',
  summary: 'Audit of subscriptions used by meteor application.',
  version: '0.0.2',
  git: 'https://github.com/dolgarev/meteor-subscription-audit.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2');
  api.use('underscore');
  api.export('SA');
  api.addFiles('main.js', ['client']);
});
