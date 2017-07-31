'use strict';

var redis = require('redis');
var send = require('./sendgrid-controller');
var subscriberClient = null;
var schedQueueClient = null;

var _require = require('./db-controller'),
    connect = _require.connect,
    executeQuery = _require.executeQuery;

var myprofile = require('./myprofile-controller');

module.exports = {
  init_schedule: function init_schedule() {
    subscriberClient = redis.createClient();
    schedQueueClient = redis.createClient();

    subscriberClient.on('pmessage', function (pattern, channel, expiredKey) {
      console.log('key [' + expiredKey + '] has expired');

      connect().then(function (obj) {
        var query = 'select email from spainschema.user_info where uid = \'' + expiredKey.split('#')[0] + '\'';
        return executeQuery(obj, query);
      }).then(function (result) {
        var message = 'Event ' + expiredKey.split('#')[1] + 'Reminder';
        myprofile.addNotification(expiredKey.split('#')[0], expiredKey.split('#')[1], 'event', 'reminder', message);
        send.contactSalesRepresentative(null, result.rows[0].email, 'event reminder');
      }).catch(function (error) {
        console.log(error);
        return 'failed';
      });
      // subscriberClient.quit();
    });

    // subscribe to key expire events on database 0
    subscriberClient.psubscribe('__keyevent@0__:expired');
    subscriberClient.on('error', function (err) {
      console.error('Error connecting to redis', err);
    });
    schedQueueClient.on('error', function (err) {
      console.error('Error connecting to redis', err);
    });
  },

  mail_schedule: function mail_schedule(uid, eventDate, eid) {
    console.log(new Date(eventDate));
    console.log(new Date());
    //  var diff = new Date("18-APR-2017 12:18:00") - new Date("18-APR-2017 12:16:00")
    // console.log(diff);
    var diff = new Date(eventDate) - new Date();
    if (diff > 0) {
      var schedule = diff / 1000 - 120;
      if (schedule > 0) {
        console.log(schedule);
        console.log(diff / 1000 - 120);
        schedQueueClient.set(uid + '#' + eid, 'ABC', 'PX', parseInt(schedule) * 1000, redis.print);
      }
    }
  }
};