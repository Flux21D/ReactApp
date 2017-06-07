"use strict";

var requireAuth = require("../middlewares/auth");
var authController = require("../controllers/auth-controller");
var userinfo = require('../controllers/userinfo-controller');
var contenthelp = require('../controllers/content-helper');
var contentextract = require('../controllers/contentful/contentextract-controller');
var push = require('../controllers/publish-controller');
var nofifypush = require('../controllers/notification-controller');
var profile = require('../controllers/myprofile-controller');
var send = require("../controllers/sendgrid-controller");
var apihandler = require("../controllers/api-controller");
var slugs = require('../../slugs.json');
var cache = require('memory-cache');
var async = require('async');

module.exports = function (app, express) {

    // Create API group routes
    var apiRoutes = express.Router();
    apiRoutes.post("/auth", authController.auth);
    apiRoutes.post("/register", authController.register);
    apiRoutes.get('/getuserinfo', userinfo.userinfo);
    apiRoutes.get('/getprofileinfo', profile.getProfileInfo);
    apiRoutes.post('/courseval', push.setScore);
    apiRoutes.get('/validate', requireAuth, function (res, resp) {
        resp.status(200).send({
            success: true,
            msg: 'Token valid'
        });
    });
    apiRoutes.post('/sendmail', function (req, res) {
        var fromail = req.body.fromail || null;
        if (req.body.tomail && req.body.message) {
            send.contactSalesRepresentative(fromail, req.body.tomail, req.body.message);
            res.send('Done');
        } else res.send('Data missing');
    });
    apiRoutes.get('/getnotifications', function (req, res) {
        if (req.headers.uid) {
            var page = req.query.page || 1;
            var uid = req.headers.uid;
            var paginate = 3;
            var end = page * paginate;
            var start = end - paginate;

            profile.getUserNotification(uid, function (results) {
                var notifications = {};
                notifications.n_length = results.length;
                notifications.content = results.length >= end ? results.slice(start, end) : results.slice(start);
                notifications.page = page;
                res.send(notifications);
            });
        }
    });
    apiRoutes.post('/couseRegister', function (req, res) {
        if (req.body) {
            if (req.body.uid && req.body.cid) {
                push.courseRegister(req.body.uid, req.body.timeStamp, req.body.cid, function (result) {
                    res.send(result);
                });
            } else res.send('Data Missing');
        }
    });
    apiRoutes.post('/saveFav', function (req, res) {
        var typeObj = {};
        if (req.body) {
            if (req.body.uid && req.body.type && req.body.type_id) {
                typeObj.type = req.body.type;

                if (req.body.eventDate) typeObj.eventDate = req.body.eventDate;
                if (req.body.url) typeObj.url = req.body.url;
                push.setFavorit(req.body.uid, typeObj, req.body.type_id, function (result) {
                    res.send(result);
                });
            } else res.send('Data Missing');
        }
    });
    apiRoutes.post('/contentChanged', function (req, res) {
        var auth = req.headers['authorization'];
        if (!auth) {
            res.status(401).send();
        } else {
            var temp_auth = auth.split(' ');
            var buf = new Buffer(temp_auth[1], 'base64');
            var plain_auth = buf.toString();
            var creds = plain_auth.split(':');
            if (creds[0] === 'elearning' && creds[1] === 'Lilly@may17') {
                if (req.body.sys.contentType.sys.id === 'toolContent') {
                    nofifypush.saveTools(req.body, function () {
                        cache.put('tool_popular', null, 900000);
                        push.getActiveCE('tool', function () {});
                        push.loadUserNotification(null, function () {});
                    });
                }
                if (req.body.sys.contentType.sys.id === 'courseBox') {
                    nofifypush.saveCourses(req.body, function () {
                        //contentfull takes some time to reflect content changes so setimeout
                        //on any changes in contentful clear cache for course page and reload page
                        setTimeout(function () {
                            cache.put(slugs.slugs["coursePage"].id, null);
                            cache.put('course_popular', null, 900000);

                            contenthelp.getPage(slugs.slugs["coursePage"].id, function (data, error) {
                                push.getActiveCE('course', function () {});
                                push.loadUserNotification(null, function () {});
                            });
                        }, 25000);
                    });
                }
                if (req.body.sys.contentType.sys.id === 'upcomingEventBox') {
                    nofifypush.saveEvent(req.body, function () {
                        cache.put('event_popular', null, 900000);
                        push.getActiveCE('event', function () {});
                        push.loadUserNotification(null, function () {});
                    });
                }

                res.status(200).send();
            } else {
                res.status(401).send();
            }
        }
    });
    apiRoutes.get('/getcontent/:slug', apihandler.getContent);

    apiRoutes.post('/getsubcontent/', apihandler.getSubContent);
    apiRoutes.post('/geticsfile', apihandler.getIcal);
    app.use("/api", apiRoutes);
};