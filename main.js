import { Meteor } from "meteor/meteor";
import { EJSON } from "meteor/ejson";

const CURRENT_CONNECTION = Meteor.connection;
const COLLECTIONS = CURRENT_CONNECTION._mongo_livedata_collections;
const SUBSCRIPTIONS = CURRENT_CONNECTION._subscriptions;

const DEFAULT_PROPS = [
  "id",
  "name",
  "params",
  "inactive",
  "ready",
  "connection",
];

/**
 * Gets a subscription by index or subscription ID
 * @param {number|string} index - Either the numeric index of the subscription or its string ID
 * @returns {Object|null} The subscription object if found, null otherwise
 * @private
 */
function _getSubscriptionByIndexOrSubscriptionId(index) {
  if (Number.isInteger(index)) {
    const subscriptionIds = Object.keys(SUBSCRIPTIONS);
    if (index >= 0 && index < subscriptionIds.length) {
      return SUBSCRIPTIONS[subscriptionIds[index]] ?? null;
    }
  } else if (typeof index === "string") {
    return SUBSCRIPTIONS[index] ?? null;
  }
  return null;
}

/**
 * Subscription Audit class
 */
export class SA {
  /**
   * List all subscriptions
   */
  static list() {
    const output = Object.values(SUBSCRIPTIONS).map((sub) => ({
      id: sub.id,
      name: sub.name,
      params: JSON.stringify(sub.params),
      inactive: sub.inactive,
      ready: sub.ready,
      "ddp session": sub.connection._lastSessionId ?? "unknown",
    }));
    console.info(new Date().toLocaleString());
    console.table(output);
  }

  /**
   * Show details of a subscription by index
   * @param {number} index - Index of the subscription
   * @param {Array<string>|string} props - Props to show
   * @param {boolean} isFormattedOutput - Whether to format the output
   */
  static show(index, props = DEFAULT_PROPS, isFormattedOutput = false) {
    const sub = _getSubscriptionByIndexOrSubscriptionId(index);
    if (!sub) {
      console.error(`Subscription ${index} not found`);
      return;
    }

    const output = Array.isArray(props)
      ? props.reduce((acc, prop) => {
          if (sub.hasOwnProperty(prop)) acc[prop] = sub[prop];
          return acc;
        }, {})
      : props === "*"
        ? sub
        : {};

    if (isFormattedOutput) {
      console.log(JSON.stringify(output, null, 2));
    } else {
      console.dir(output);
    }
  }

  /**
   * Show all details of a subscription by index
   * @param {number} index - Index of the subscription
   */
  static showDetails(index) {
    SA.show(index, "*");
  }

  /**
   * Show parameters of a subscription by index
   * @param {number} index - Index of the subscription
   */
  static showParams(index) {
    SA.show(index, ["params"], true);
  }

  /**
   * Stop a subscription by index
   * @param {number} index - Index of the subscription
   */
  static stop(index) {
    const sub = _getSubscriptionByIndexOrSubscriptionId(index);
    if (sub) {
      sub.stop();
      console.info(`Subscription ${sub.id} was stopped`);
    } else {
      console.error(`Subscription ${index} not found`);
    }
  }

  /**
   * Show duplicate subscriptions
   */
  static showDups() {
    const subsByIdMap = Object.fromEntries(
      Object.values(SUBSCRIPTIONS).map((sub) => [sub.id, sub]),
    );
    const subsByNameMap = Object.values(SUBSCRIPTIONS).reduce((acc, sub) => {
      (acc[sub.name] ??= []).push(sub);
      return acc;
    }, {});

    const subsGroups = Object.values(subsByNameMap).filter(
      (group) => group.length > 1,
    );

    for (const subsGroup of subsGroups) {
      const params = subsGroup.map(({ params }) => params);

      const dups = {};
      for (const sub of subsGroup) {
        const subId = sub.id;
        for (const param of params) {
          if (EJSON.equals(sub.params, param)) {
            dups[subId] = dups[subId] ? dups[subId] + 1 : 1;
          }
        }
      }

      const subIds = Object.keys(dups).filter((subId) => dups[subId] > 0);
      if (subIds.length === 0) continue;

      const output = [];
      for (const subId of subIds) {
        const sub = subsByIdMap[subId];
        if (sub) {
          output.push({
            id: sub.id,
            params: JSON.stringify(sub.params),
            "ddp session": sub.connection._lastSessionId,
          });
        }
      }
      console.group(subsGroup[0].name);
      console.table(output);
      console.groupEnd();
    }
  }

  /**
   * List all collections
   */
  static collList() {
    const output = Object.entries(COLLECTIONS).map(([name, collection]) => ({
      collection: name,
      size: collection.find().count(),
    }));
    console.info(new Date().toLocaleString());
    console.table(output);
  }
}

console.info(
  "Hello! This is a subscription audit package. I'm here to help you audit your subscriptions.",
);
