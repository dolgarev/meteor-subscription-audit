/* global Package */

Package.describe({
  name: "liberation:subscription-audit",
  summary: "Analyzing subscriptions used by Meteor applications.",
  version: "0.0.4",
  git: "https://github.com/dolgarev/meteor-subscription-audit.git",
});

Package.onUse(function (api) {
  api.versionsFrom("1.5"); // Specify the minimum Meteor version
  api.use(["ecmascript", "ejson"], "client"); // Dependencies for the client
  api.mainModule("main.js", "client"); // Main entry point for the client
  api.export("SA"); // Export the SA symbol
});
