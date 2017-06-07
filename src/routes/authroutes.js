"use strict";

var winston = require('winston');
module.exports = function (app, express) {

 

  app.get('/auth/forcedotcom', function (req, res, next) {
    winston.info('User not authenticated in /auth/forcedotcom :' + req.query.redirect);
    if (req.query.redirect) {
      req.session.authRedirect = req.query.redirect;
    }
    passport.authenticate('forcedotcom')(req, res, next);
  });

  app.get('/auth/forcedotcom/callback', passport.authenticate('forcedotcom', {
    failureRedirect: '/error'
  }), function (req, res) {
    winston.info('User not authenticated in /auth/forcedotcom/callback :');
    var redirect = req.session.authRedirect;
    var querystring = void 0;
    if (req.session.qstr) {
      querystring = req.session.qstr;
      delete req.session.qstr;
    }
    if (redirect) {
      delete req.session.authRedirect;
    }
    if (querystring != undefined) {
      winston.info('User not authenticated in /auth/forcedotcom/callback redirecting to:' + redirect + querystring);
      res.redirect(303, redirect + querystring || '/');
    } else {
      res.redirect(303, redirect || '/');
    }
  });


};