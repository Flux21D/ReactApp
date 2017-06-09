// Routes in this module require authentication
import express from 'express';

// Importing the server side modules.
// import testFile from '../server-controllers/test';

// Importing authentication flow
import auth from '../web/auth';
const GTMConfigs = require("../configs/gtm");
const router = express.Router();

// authenticate our router
auth.authenticate(router);

router.get('*', (req, res) => {
  return res.render('index', {
        layout: false,
        gtmContainerId: GTMConfigs.CONTAINER_ID
      });
});

router.get('/', (req, res) => {
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
