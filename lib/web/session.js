'use strict';

var session = require('express-session');
var winston = require('winston');
var MemoryStore = session.MemoryStore;
var RedisStore = require('connect-redis')(session);
var redis = require('redis');

var sessionOpts = void 0;

if (process.env.LOCAL_DEV === 'true') {
  winston.info('LOCAL_DEV true setting session to MemoryStore');
  sessionOpts = {
    secure: true,
    saveUninitialized: false, // saved new sessions
    resave: false, // do not automatically write to the session store
    store: new MemoryStore(),
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      maxAge: 1800000
    }
  };
  process.env.AUTH_REQUIRED = false;
} else {
  process.env.AUTH_REQUIRED = true;
  winston.info('LOCAL_DEV false setting session to RedisStore');
  winston.info('Connecting to Redis :' + process.env.REDIS_URL);
  var client = redis.createClient(process.env.REDIS_URL);
  client.on('error', function (err) {
    winston.info('Connecting to Redis error:' + err);
    console.log('Redis' + err);
  });
  sessionOpts = {
    secure: true,
    saveUninitialized: false, // saved new sessions
    resave: false, // do not automatically write to the session store
    store: new RedisStore({
      client: client
    }),
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      maxAge: 1800000
    }
  };
}

module.exports = function (app) {
  return app.use(session(sessionOpts));
};