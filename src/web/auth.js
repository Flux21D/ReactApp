const express = require('express');
const winston = require('winston');

const ensureAuthenticated = (req, res, next) => {
  winston.info('In ensureAuthenticated');
    // If the user is already authenticated or AUTH is not required - skip
  if (req.isAuthenticated() || process.env.AUTH_REQUIRED === 'false' || isValidExternalUser(req)) {
    winston.info('User authenticated going to next');
    return next();
  }
  winston.info('User not authenticated going to redirect /auth/forcedotcom');
  if(req.originalUrl.indexOf('?') > 0) {
    req.session.qstr = req.originalUrl.substring(req.originalUrl.indexOf('?'),req.originalUrl.length);
    req.originalUrl = req.originalUrl.substring(0,req.originalUrl.indexOf('?'));
    winston.info('User not authenticated query str :'+req.session.qstr);
    winston.info('User not authenticated orig url :'+req.originalUrl);
  }
  return res.redirect(`/auth/forcedotcom?redirect=${req.originalUrl}`);
};

const isValidExternalUser =function (req) {
  const EXTERNAL_ACCESS = process.env.EXTERNAL_ACCESS;
  const externalIPs = process.env.IP_ADDR.split(',');
  const refinedExternalIPsIp = externalIPs.map((s) => { return s.trim(); });
  const ip = req.headers['x-forwarded-for'];

  if (EXTERNAL_ACCESS === 'true' && refinedExternalIPsIp.indexOf(ip) >= 0) {
    winston.info('isValidExternalUser true :');
    return true;
  }
  winston.info('isValidExternalUser false :');
  return false;
}

  
module.exports = {
  ensureAuthenticated,
  isValidExternalUser
};
