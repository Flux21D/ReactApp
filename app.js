require('dotenv').config();
// importing modules
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const winston = require('winston');
const expressHandlebars = require('express-handlebars');
const push = require('./lib/server-controllers/publish-controller');
let appForSocket = null;
const cache = require('memory-cache');


// Importing the express module under the `app` variable
const app = express();
const port = process.env.PORT || '8080';
/* If the user is local development import the .env file, else do not load the
.env file. Also if production is set start newrelic for monitoring*/
if (app.get('env') === 'development') {
  /* eslint-disable global-require */
  require('dotenv').config();
} else if (app.get('env') === 'production') {
  // Import the NewRelic Module.
  require('newrelic');
} else {
  console.log('Please set your NODE_ENV to either `development` or `production`');
}

// Importing the favicon
//app.use(favicon(`${__dirname}/lib/public/favicon.ico`));

// Added further layer of security
app.use(helmet());

// Importing all routes to the server
const authenticatedRoutes = require('./lib/routes/authenticated-routes');

// Configure the express app
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

//This settings is for receiving notification from contentful
app.use(bodyParser.json({ type: 'application/vnd.contentful.management.v1+json' }));

require('./lib/web/session')(app);

// compress all routes
app.use(compression());

// view engine setup and public static directory
app.set('views', path.join(__dirname, 'views'));

const handlebars = expressHandlebars.create({});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'lib/public')));


// Load authenticated routes
app.use('/', authenticatedRoutes);


//require('./lib/routes')(app, express);
require('./lib/routes/apiroutes')(app, express);

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



// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

// development error handler will print stck trace
// To run in development mode set config var NODE_ENV to 'development'
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler. No stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

appForSocket = app.listen(port, () => {
  console.log(`Server running at localhost:${port}`);
});

require('./lib/server-controllers/socket-controller').initSocket(appForSocket);
require('./lib/server-controllers/eventschedule-controller').run_scheduler();

module.exports = app;
