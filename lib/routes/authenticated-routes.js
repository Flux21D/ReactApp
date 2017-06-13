'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _auth = require('../web/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Routes in this module require authentication
var GTMConfigs = require("../configs/gtm");

// Importing the server side modules.
// import testFile from '../server-controllers/test';

// Importing authentication flow

var router = _express2.default.Router();

// authenticate our router
_auth2.default.authenticate(router);

router.get('*', function (req, res) {
      return res.render('index', {
            layout: false,
            gtmContainerId: GTMConfigs.CONTAINER_ID
      });
});

router.get('/', function (req, res) {
      return res.render('index', {
            layout: false,
            gtmContainerId: GTMConfigs.CONTAINER_ID
      });
});

// index route
// router.get('/about', (req, res) => {
//   testFile.test().then((data) => {
//     return res.render('about', {
//       title: data,
//     });
//   }).catch((e) => {
//     res.status(500, {
//       error: e,
//     });
//   });
// });

module.exports = router;