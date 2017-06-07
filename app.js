require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const winston = require('winston');
const expressHandlebars = require('express-handlebars');
const MemoryStore = session.MemoryStore;
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
passport = require('passport');
const ForceDotComStrategy = require('passport-forcedotcom').Strategy;
const app = express();
const GTMConfigs = require("./lib/configs/gtm");
const autFile = require('./lib/web/auth');
const push = require('./lib/controllers/publish-controller');
let appForSocket = null;
var cache = require('memory-cache');
// Our port the application will listen on.
const PORT = process.env.PORT || 8080;
//let sessionOpts;

//This settings is for receiving notification from contentful
app.use(bodyParser.json({ type: 'application/vnd.contentful.management.v1+json' }));

require('./lib/web/session')(app);

app.use(morgan('dev'));
//app.use(session(sessionOpts));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const handlebars = expressHandlebars.create({});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'lib/public')));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

const sfStrategy = new ForceDotComStrategy({
  clientID: process.env.CF_CLIENT_ID,
  clientSecret: process.env.CF_CLIENT_SECRET,
  callbackURL: process.env.CF_CALLBACK_URL,
  authorizationURL: process.env.SF_AUTHORIZE_URL,
  tokenURL: process.env.SF_TOKEN_URL,
  profileFields: ['user_id', 'first_name'],
}, (accessToken, refreshToken, profile, done) => {
    // Only retain the profile properties we need.
  profile.user_id = profile._raw.user_id;
  delete profile._raw;// eslint-disable no-underscore-dangle
  delete profile.displayName;
  delete profile.name;
  delete profile.emails;

  return done(null, profile);
});

passport.use(sfStrategy);
app.use(passport.initialize());
app.use(passport.session());

//require('./lib/routes')(app, express);
require('./lib/routes/apiroutes')(app, express);
require('./lib/routes/authroutes')(app, express);

cache.put('course_popular',null,900000);
cache.put('event_popular',null,900000);
cache.put('tool_popular', null, 900000);

// load notification
push.loadContentful(function(){
  console.log('Contentful load done');
  push.loadUserNotification(null,function(){});
  // you need to call this so initial popular courses,events and tools will be loaded inti cache
  push.getActiveCE('course',function(){});
  push.getActiveCE('event',function(){});
  push.getActiveCE('tool',function(){});
});



app.get('*', autFile.ensureAuthenticated, (req, res) => {
  return res.render('index', {
    layout: false,
    gtmContainerId: GTMConfigs.CONTAINER_ID
  });
});

app.get('/', (req, res) => {
  winston.info('User authenticated / :');
  if ((!req.user) && (process.env.AUTH_REQUIRED === 'true')) {
    if (autFile.isValidExternalUser(req)) {
      return res.render('index', {
        layout: false,
        gtmContainerId: GTMConfigs.CONTAINER_ID
      });
    }
    req.session.destroy();
    req.logout();
    return res.redirect('/auth/forcedotcom');
  }
  return res.render('index', {layout: false});
});

app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  return res.render('logout');
});

app.set('trust proxy', 1); // trust first proxy

appForSocket = app.listen(PORT, () => {
  console.log(`Server running at localhost:${PORT}`);
});

require('./lib/controllers/socket-controller').initSocket(appForSocket);
//require('./lib/controllers/event-controller').init_schedule();
//require('./lib/controllers/eventschedule-controller').run_scheduler();
module.exports = app;
