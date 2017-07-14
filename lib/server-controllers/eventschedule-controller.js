"use strict";

var send = require("./sendgrid-controller");

var _require = require('./db-controller'),
    connect = _require.connect,
    executeQuery = _require.executeQuery,
    executeBatch = _require.executeBatch;

var send = require("./sendgrid-controller");
var profile = require('./myprofile-controller');

function secondsToDate(secs) {
    var d = new Date();
    d.setSeconds(secs);
    return d;
}

var addSchedule = function addSchedule(uid, type_id, email_date) {
    var query = '';

    connect().then(function (userobj) {
        query = "insert into spainschema.schedule_mail (uid,type_id,action,email_date,status) values ('" + uid + "','" + type_id + "','reminder','" + new Date(email_date).toISOString() + "','pending') " + "on conflict ON CONSTRAINT schedule_mail_uid_type_id_action_key do NOTHING";

        return executeQuery(userobj, query);
    }).then(function (execResult) {
        return execResult;
    }).catch(function (error) {
        console.log(error);
        return "failed";
    });
};

var updateSchedule = function updateSchedule(batchQuery, callback) {
    //let query = '';

    connect().then(function (userobj) {
        //query = "update spainschema.schedule_mail set status = 'done' where uid = '"+uid+"' and type_id = '"+type_id+"' and action = '"+action+"'";

        return executeBatch(userobj, batchQuery);
    }).then(function (execResult) {
        //return execResult;
        callback();
    }).catch(function (error) {
        console.log(error);
        callback();
        //return "failed"
    });
};

var poll_schedule = function poll_schedule() {
    var query = void 0;
    //Since this file is called in app.js was not able to get functions of publish-controller
    //so added inside poll_schedule
    var push = require('./publish-controller');
    connect().then(function (userobj) {
        //query = "select * from  spainschema.schedule_mail sm, spainschema.user_info ui where status = 'pending' and email_date <= now() and sm.uid = ui.uid";
        query = "select ui.*,cei.*,sm.* from  spainschema.schedule_mail sm, spainschema.user_info ui, spainschema.course_event_info cei where status = 'pending' and email_date <= CAST(NOW() at time zone 'utc' AS timestamp) and sm.uid = ui.uid and cei.id=sm.type_id";
        return executeQuery(userobj, query);
    }).then(function (execResult) {
        var mailObj = {};
        var batchQuery = [];
        var batchNotify = [];
        var query = "";
        var notifyQuery = "";
        var track = 0;
        execResult.rows.forEach(function (item) {
            mailObj = {
                tomail: item.email,
                fromail: process.env.FROM_MAIL,
                subject: 'event reminder',
                message: 'This mail is reminder for event: ' + item.description + ' date: ' + item.start_date + ""
            };
            send.contactSalesRepresentative(mailObj, function (err, done) {
                track = track + 1;
                // if(!err)
                //     updateSchedule(item.uid,item.id,item.action);
                if (!err) {
                    query = "update spainschema.schedule_mail set status = 'done' where uid = '" + item.uid + "' and type_id = '" + item.id + "' and action = '" + item.action + "'";
                    batchQuery.push(query);
                }

                notifyQuery = "insert into spainschema.user_notification_map (uid,notification_type,notification_desc,status,action,type_id)" + "values ('" + item.uid + "','event','reminder for event: " + item.description + " date: " + item.start_date + "','unseen','reminder','" + item.id + "')" + "on conflict ON CONSTRAINT user_notification_map_uid_type_id_action_key do NOTHING";

                batchNotify.push(notifyQuery);

                if (track == execResult.rows.length) {
                    updateSchedule(batchQuery, function () {
                        profile.addNotificationBatch(batchNotify, function () {
                            push.loadUserNotification(null, function () {});
                        });
                    });
                }
            });
        });
        //updateSchedule(batchQuery);
        return execResult;
    }).catch(function (error) {
        console.log(error);
        return "failed";
    });
};

module.exports = {
    add_schedule: function add_schedule(uid, eventDate, type_id) {

        var diff = new Date(eventDate) - new Date();

        if (diff > 0) {
            var schedule = (diff/1000) - 3000; //convert to seconds and reduce 120 seconds;
            console.log(schedule);
            if (schedule > 0) {
                //schedQueueClient.set(uid + '#' + eid, "ABC", "PX", parseInt(schedule) * 1000, redis.print);
                //TODO check schedule greater than 86400 one day
                console.log(secondsToDate(schedule));
                addSchedule(uid, type_id, secondsToDate(schedule));
            }
        }
    },

    run_scheduler: function run_scheduler() {
        //3hrs 10800000 milli sec
        setInterval(function () {
            console.log('pollllllllling');
            poll_schedule();
        }, 300000);
    }

};