"use strict";

var send = require("./sendgrid-controller");

var _require = require('./db-controller'),
    connect = _require.connect,
    executeQuery = _require.executeQuery,
    executeBatch = _require.executeBatch;

var send = require("./sendgrid-controller");

function secondsToDate(secs) {
    var d = new Date();
    d.setSeconds(secs);
    return d;
}

var addSchedule = function addSchedule(uid, type_id, email_date) {
    var query = '';

    connect().then(function (userobj) {
        query = "insert into spainschema.schedule_mail (uid,type_id,action,email_date,status) values ('" + uid + "','" + type_id + "','reminder','" + email_date + "','pending') " + "on conflict ON CONSTRAINT schedule_mail_uid_type_id_action_key do NOTHING";

        return executeQuery(userobj, batchQuery);
    }).then(function (execResult) {
        return execResult;
    }).catch(function (error) {
        console.log(error);
        return "failed";
    });
};

var updateSchedule = function updateSchedule(batchQuery) {
    //let query = '';

    connect().then(function (userobj) {
        //query = "update spainschema.schedule_mail set status = 'done' where uid = '"+uid+"' and type_id = '"+type_id+"' and action = '"+action+"'";

        return executeBatch(userobj, batchQuery);
    }).then(function (execResult) {
        return execResult;
    }).catch(function (error) {
        console.log(error);
        return "failed";
    });
};

var poll_schedule = function poll_schedule() {
    var query = void 0;
    connect().then(function (userobj) {
        //query = "select * from  spainschema.schedule_mail sm, spainschema.user_info ui where status = 'pending' and email_date <= now() and sm.uid = ui.uid";
        query = "select ui.*,cei.*,sm.* from  spainschema.schedule_mail sm, spainschema.user_info ui, spainschema.course_event_info cei where status = 'pending' and email_date <= now() and sm.uid = ui.uid and cei.id=sm.type_id";
        return executeQuery(userobj, query);
    }).then(function (execResult) {
        var mailObj = {};
        var batchQuery = [];
        var query = "";
        var track = 0;
        execResult.rows.forEach(function (item) {
            mailObj = {
                tomail: item.email,
                fromail: process.env.FROM_MAIL,
                subject: 'event reminder',
                message: 'This mail is reminder for event: ' + item.decription + ' date: ' + item.start_date + ""
            };
            send.contactSalesRepresentative(mailObj, function (err, done) {
                track = track + 1;
                // if(!err)
                //     updateSchedule(item.uid,item.id,item.action);
                if (!err) {
                    query = "update spainschema.schedule_mail set status = 'done' where uid = '" + item.uid + "' and type_id = '" + item.id + "' and action = '" + item.action + "'";
                    batchQuery.push(query);
                }
                if (track == execResult.rows.length) updateSchedule(batchQuery);
            });
        });
        updateSchedule(batchQuery);
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
            var schedule = diff / 1000 - 120; //convert to seconds and reduce 120 seconds;
            if (schedule > 0) {
                //schedQueueClient.set(uid + '#' + eid, "ABC", "PX", parseInt(schedule) * 1000, redis.print);
                //TODO check schedule greater than 86400 one day
                addSchedule(uid, type_id, secondsToDate(schedule));
            }
        }
    },

    run_scheduler: function run_scheduler() {
        //3hrs
        setInterval(function () {
            poll_schedule();
        }, 10800000);
    }

};