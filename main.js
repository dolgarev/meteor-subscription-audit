var subs = Meteor.connection._subscriptions;

var _getSubscription = function(index) {
    var key = +index >= 0 ? _.keys(subs)[+index] : index,
        sub = _.isString(key) ? subs[key] : null;

    return sub;
};

if (_.isUndefined(SA)) {
  SA = {};
}

_.extend(SA, {
    list: function() {
        output = _.map(_.values(subs), function(sub) {
            return {
                'id': sub.id,
                'name': sub.name,
                'params': JSON.stringify(sub.params),
                'inactive': sub.inactive,
                'ready': sub.ready,
                'ddp session': sub.connection._lastSessionId
            };
        });

        console.info(new Date().toLocaleString())
        console.table(output);
    },
    show: function(index, fields) {
        var sub = _getSubscription(index);

        if (sub) {
            if (fields === true) {
                var output = sub;
            }
            else {
                fields = _.isArray(fields) ? fields : ['id', 'name', 'params', 'inactive', 'ready'];
                var output = _.pick(sub, fields);
            }
            console.dir(output);
        }
        else {
            console.error("Subscription %s not found", index);
        }
    },
    showDetails: function(index) {
        this.show(index, true);
    },
    showParams: function(index) {
        this.show(index, ['params']);
    },
    showDups: function () {
        var groups = _.filter(_.groupBy(_.values(subs), 'name'), function(group) {
            return group.length > 1;
        });

        _.each(groups, function(group) {
          var params = _.pluck(group, "params"),
              dups = {};

          _.each(group, function(sub) {
            _.each(params, function(param) {
              if (EJSON.equals(sub.params, param)) {
                if (_.has(dups, sub.id)) {
                  dups[sub.id]++;
                }
                else {
                  dups[sub.id] = 0;
                }
              }
            });
          });

          var subIds = _.filter(_.keys(dups), function(subId) {
            return dups[subId] > 0;
          });

          if (subIds.length) {
            var idxSubs = _.indexBy(subs, 'id'),
                output = {};

            _.each(subIds, function(subId) {
              output[subId] = {
                "params": JSON.stringify(idxSubs[subId].params),
                "ddp session": idxSubs[subId].connection._lastSessionId
              }
            });

            console.group(group[0].name);
            console.table(output);
            console.groupEnd();
          }
        });
    },
    stop: function(index) {
        var sub = _getSubscription(index);

        if (sub) {
            sub.stop();
            console.info("Subscription %s was stopped", sub.id);
        }
        else {
            console.error("Subscription %s not found", index);
        }
    }
});
