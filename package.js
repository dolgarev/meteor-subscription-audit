/* global Package */

Package.describe({
  name: 'liberation:subscription-audit',
  summary: 'Audit of subscriptions used by meteor application.',
  version: '0.0.4',
  git: 'https://github.com/dolgarev/meteor-subscription-audit.git'
})

Package.onUse(function (api) {
  api.versionsFrom('1.5')
  api.use(['ecmascript', 'ejson', 'underscore'], 'client')
  api.mainModule('main.js', 'client')
  api.export('SA')
})
