'use strict';

var _require = require('./db-controller'),
    connect = _require.connect,
    executeQuery = _require.executeQuery;

module.exports = {

  saveTools: function saveTools(tool, callback) {
    var query = '';

    connect().then(function (client) {
      // let specialization = tool.fields.speciality['en-US'].split(',').reduce(function(prev,cur){
      //                    return prev.toLowerCase().trim()+','+cur.toLowerCase().trim();
      //                });

      // query =  "insert into spainschema.course_event_info (id,description,name,type,is_active,specialization)"+
      //           " values('"+tool.sys.id+"','"+tool.fields.description['en-US']+"','"+tool.fields.title['en-US']+"','tool','"+(tool.fields.isActive['en-US']===true)+"','{"+specialization+"}') on conflict ON CONSTRAINT course_event_info_pkey "+
      //           "do update set description = '"+tool.fields.description['en-US']+"',name = '"+tool.fields.title['en-US']+"',type = 'tool',is_active = '"+(tool.fields.isActive['en-US']===true)+"',specialization='{"+specialization+"}' ";

      query = "insert into spainschema.course_event_info (id,description,name,type,is_active,specialization)" + " values('" + tool.sys.id + "','" + tool.fields.description['en-US'] + "','" + tool.fields.title['en-US'] + "','tool','" + (tool.fields.isActive['en-US'] === true) + "','{all}') on conflict ON CONSTRAINT course_event_info_pkey " + "do update set description = '" + tool.fields.description['en-US'] + "',name = '" + tool.fields.title['en-US'] + "',type = 'tool',is_active = '" + (tool.fields.isActive['en-US'] === true) + "',specialization='{all}' ";

      return executeQuery(client, query);
    }).then(function (result) {
      callback(result);
    }).catch(function (error) {
      console.log(error);
      callback(error);
    });
  },

  saveCourses: function saveCourses(course, callback) {
    var query = '';
    //Add try catch for empty speciality
    var specialization = course.fields.speciality['en-US'].split(',').reduce(function (prev, cur) {
      return prev.toLowerCase().trim() + ',' + cur.toLowerCase().trim();
    });

    connect().then(function (obj) {
      if (course.fields.startDate && course.fields.endDate) query = "insert into spainschema.course_event_info (id,description,name,type,is_active,start_date,end_date,ce_type,specialization)" + " values('" + course.sys.id + "','" + course.fields.courseDescription['en-US'] + "','" + course.fields.courseTitle['en-US'] + "','course','" + (course.fields.isActive['en-US'] === true) + "','" + new Date(course.fields.startDate['en-US']).toISOString() + "','" + new Date(course.fields.endDate['en-US']).toISOString() + "','" + course.fields.courseType['en-US'] + "','{" + specialization + "}') on conflict ON CONSTRAINT course_event_info_pkey " + "do update set description = '" + course.fields.courseDescription['en-US'] + "',name = '" + course.fields.courseTitle['en-US'] + "',type = 'course',is_active = '" + (course.fields.isActive['en-US'] === true) + "',start_date='" + new Date(course.fields.startDate['en-US']).toISOString() + "',end_date='" + new Date(course.fields.endDate['en-US']).toISOString() + "',ce_type = '" + course.fields.courseType['en-US'] + "',specialization='{" + specialization + "}' ";else query = "insert into spainschema.course_event_info (id,description,name,type,is_active,ce_type,specialization)" + " values('" + course.sys.id + "','" + course.fields.courseDescription['en-US'] + "','" + course.fields.courseTitle['en-US'] + "','course','" + (course.fields.isActive['en-US'] === true) + "','" + course.fields.courseType['en-US'] + "','{" + specialization + "}') on conflict ON CONSTRAINT course_event_info_pkey " + "do update set description = '" + course.fields.courseDescription['en-US'] + "',name = '" + course.fields.courseTitle['en-US'] + "',type = 'course',is_active = '" + (course.fields.isActive['en-US'] === true) + "',ce_type = '" + course.fields.courseType['en-US'] + "',specialization='{" + specialization + "}' ";

      console.log(query);
      return executeQuery(obj, query);
    }).then(function (result) {
      callback(result);
    }).catch(function (error) {
      console.log(error);
      callback(error);
    });
  },

  saveEvent: function saveEvent(upevent, callback) {
    var query = '';

    var specialization = upevent.fields.speciality['en-US'].split(',').reduce(function (prev, cur) {
      return prev.toLowerCase().trim() + ',' + cur.toLowerCase().trim();
    });

    connect().then(function (obj) {
      query = "insert into spainschema.course_event_info (id,description,name,type,is_active,start_date,end_date,ce_type,specialization)" + " values('" + upevent.sys.id + "','" + upevent.fields.description['en-US'] + "','" + upevent.fields.mainTitle['en-US'] + "','event','" + (upevent.fields.isActive['en-US'] === true) + "','" + new Date(upevent.fields.startDate['en-US']).toISOString() + "','" + new Date(upevent.fields.endDate['en-US']).toISOString() + "','" + upevent.fields.eventType['en-US'] + "','{" + specialization + "}') on conflict ON CONSTRAINT course_event_info_pkey " + "do update set description = '" + upevent.fields.description['en-US'] + "',name = '" + upevent.fields.mainTitle['en-US'] + "',type = 'event',is_active = '" + (upevent.fields.isActive['en-US'] === true) + "',start_date='" + new Date(upevent.fields.startDate['en-US']).toISOString() + "',end_date='" + new Date(upevent.fields.endDate['en-US']).toISOString() + "',ce_type = '" + upevent.fields.eventType['en-US'] + "',specialization='{" + specialization + "}' ";
      return executeQuery(obj, query);
    }).then(function (result) {
      callback(result);
    }).catch(function (error) {
      console.log(error);
      callback(error);
    });
  },
  saveNews: function saveNews(news, callback) {
    var query = '';

    var specialization = news.fields.speciality['en-US'].split(',').reduce(function (prev, cur) {
      return prev.toLowerCase().trim() + ',' + cur.toLowerCase().trim();
    });

    connect().then(function (obj) {
      query = "insert into spainschema.course_event_info (id,description,name,type,is_active,ce_type,specialization)" + " values('" + news.sys.id + "','" + news.fields.description['en-US'] + "','" + news.fields.title['en-US'] + "','news',true,'news','{" + specialization + "}') on conflict ON CONSTRAINT course_event_info_pkey " + "do update set description = '" + news.fields.description['en-US'] + "',name = '" + news.fields.title['en-US'] + "',type = 'news',is_active = true , ce_type = 'news',specialization='{" + specialization + "}' ";

      return executeQuery(obj, query);
    }).then(function (result) {
      callback(result);
    }).catch(function (error) {
      console.log(error);
      callback(error);
    });
  }

};