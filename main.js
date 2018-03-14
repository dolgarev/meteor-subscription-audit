import { Meteor } from 'meteor/meteor'
import { EJSON } from 'meteor/ejson'
import { _ } from 'meteor/underscore'

const SUBSCRIPTIONS = Meteor.connection._subscriptions

function _getSubscriptionByIndex (index) {
  const idx = +index
  const key = idx >= 0
    ? _.keys(SUBSCRIPTIONS)[idx]
    : idx
  return _.isString(key)
    ? SUBSCRIPTIONS[key]
    : null
}

export default class SA {
  static list () {
    const output = _.map(SUBSCRIPTIONS, sub => ({
      'id': sub.id,
      'name': sub.name,
      'params': JSON.stringify(sub.params),
      'inactive': sub.inactive,
      'ready': sub.ready,
      'ddp session': sub.connection._lastSessionId
    }))
    console.info(new Date().toLocaleString())
    console.table(output)
  }

  static show (
    index,
    fields = ['id', 'name', 'params', 'inactive', 'ready'],
    isFormattedOutput = false
  ) {
    const sub = _getSubscriptionByIndex(index)
    if (!sub) {
      console.error('Subscription %s not found', index)
      return
    }

    const output = Array.isArray(fields)
      ? _.pick(sub, fields)
      : (fields === '*' ? sub : null)

    if (isFormattedOutput) {
      console.log(JSON.stringify(output, null, 2))
    } else {
      console.dir(output)
    }
  }

  static showDetails (index) {
    this.show(index, '*')
  }

  static showParams (index) {
    this.show(index, ['params'], true)
  }

  static stop (index) {
    const sub = _getSubscriptionByIndex(index)
    if (sub) {
      sub.stop()
      console.info('Subscription %s was stopped', sub.id)
    } else {
      console.error('Subscription %s not found', index)
    }
  }

  static collList () {
    const collections = Meteor.connection._mongo_livedata_collections
    const output = _.map(collections, (collection, name) => ({
      collection: name,
      size: collection.find().count()
    }))
    console.info(new Date().toLocaleString())
    console.table(output)
  }

  static showDups () {
    const idxSubsByName = _.groupBy(_.values(SUBSCRIPTIONS), 'name')
    const subsGroups = _.filter(idxSubsByName, group => group.length > 1)

    _.each(subsGroups, subsGroup => {
      const params = _.pluck(subsGroup, 'params')
      const dups = {}

      _.each(subsGroup, sub => {
        const subscriptionId = sub.id
        _.each(params, param => {
          if (EJSON.equals(sub.params, param)) {
            dups[subscriptionId] = _.has(dups, subscriptionId)
              ? dups[subscriptionId] + 1
              : 0
          }
        })
      })

      const subIds = _.filter(_.keys(dups), subId => dups[subId] > 0)
      if (subIds.length === 0) return

      const idxSubsById = _.indexBy(SUBSCRIPTIONS, 'id')
      const output = {}
      _.each(subIds, subId => {
        const sub = idxSubsById[subId]
        if (sub) {
          output[subId] = {
            'params': JSON.stringify(sub.params),
            'ddp session': sub.connection._lastSessionId
          }
        }
      })
      console.group(subsGroup[0].name)
      console.table(output)
      console.groupEnd()
    })
  }
}
