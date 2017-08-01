'use strict';

var _require = require('./db-controller'),
    connect = _require.connect,
    executeQuery = _require.executeQuery,
    executeBatch = _require.executeBatch;

var TotalPlatformUsers = function TotalPlatformUsers(uid) {
  var query = '';
  connect().then(function (obj) {
    query = "";
    return executeQuery(obj, query);
  }).then(function (result) {
    if (cache.get(uid)) {
      cache.put(uid, 0);
    }
    socketPush.sendNotification(uid, 0);
  }).catch(function (error) {
    console.log(error);
    return "failed";
  });
};