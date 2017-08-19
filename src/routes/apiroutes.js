'use strict';

var userController = require('../controller/auth-controller');

module.exports = function (app, express) {
    var apiRoutes = express.Router();
    apiRoutes.post('/loggedin', userController.checkUser);
    app.use('/', apiRoutes);
};