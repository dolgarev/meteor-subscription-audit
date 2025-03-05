# meteor-subscription-audit

This package is designed for analyzing subscriptions used by Meteor applications.

## Installation

To install the package, run the following command:

```sh
meteor add liberation:subscription-audit
```

## Goals

This package allows you to display and evaluate which subscriptions are used on a given page, their parameters, detect duplicate subscriptions, and freely turn them off.

## Usage

All commands are executed in the browser console (note: this package is tested only in the Chrome console).

- `SA.list()` - Displays data about all subscriptions on a given page in a table. Each row has a unique address that you can use along with the subscription ID in the following commands. Be cautious as indexes may change over time.
- `SA.show(<index|subscription_id>)` - Shows brief information about a subscription.
- `SA.showDetails(<index|subscription_id>)` - Shows detailed information about a subscription.
- `SA.showParams(<index|subscription_id>)` - Shows only the parameters of a subscription.
- `SA.showDups()` - Displays information about duplicate subscriptions.
- `SA.stop(<index|subscription_id>)` - Stops a subscription.
- `SA.collList()` - Shows brief information about all collections.

