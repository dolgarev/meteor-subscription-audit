# meteor-subscription-audit
This package is made for analysis of subscriptions used by meteor application.

## Install package
    meteor add liberation:subscription-audit

## Goals
This package allows to show and evaluate, which subscriptions are uses at a given page, their parameters, detect doubling subscriptions and turn them off freely.

## Usage
All commands are being done in browser console (but note, this package is tested only in Chrome console).  

* `SA.list()` - at a console shows data about all subscriptions at a given page. They are shown in a table. Each line has a unique address, which you may use along with subscription ID in following commands. But be careful since indexes may change within time.
* `SA.show(<index|subscription_id>)` - shows short info about subscription
* `SA.showDetails(<index|subscription_id>)` -  detailed info about subscription
* `SA.showParams(<index|subscription_id>)` - only info about parameters of subscription
* `SA.showDups()` - shows info about doubling of subscriptions
* `SA.stop(<index|subscription_id>)` - stop subscription
