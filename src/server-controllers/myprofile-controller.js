var {connect,executeQuery,executeBatch} = require('./db-controller');
var async = require('async');


const addNotification = (uid,type_id,type,action,desc,callback) => {
  let query = '';

  connect().then(function(userobj){     
    query = "insert into spainschema.user_notification_map (uid,notification_type,notification_desc,status,action,type_id)"+
                "values ('"+uid+"','"+type+"','"+desc+"','unseen','"+action+"','"+type_id+"')"+
                "on conflict ON CONSTRAINT user_notification_map_uid_type_id_action_key do NOTHING";
                                        
    return executeQuery(userobj, query);
  })
    .then(function(execResult){
        //return execResult;
      callback();
    })
    .catch(function(error){ 
      console.log(error);
      callback();
        //return "failed"
    });

}

const addNotificationBatch = (batchQuery,callback) => {
  let query = '';

  connect().then(function(userobj){     
                                        
    return executeBatch(userobj, batchQuery);
  })
    .then(function(execResult){
        //return execResult;
      callback();
    })
    .catch(function(error){ 
      console.log(error);
        //return "failed"
      callback();
    });

}

const getProfileInfo = (req,res) => {
    
  if(req.headers.uid && req.headers.speciality){
    let uid = req.headers.uid;
    let speciality = req.headers.speciality.toLowerCase();
    let isDelegate = req.headers.isdelegate == 'true' || false;

    async.parallel({
      specialityCourses: getSpecialityCourses.bind(null,uid,speciality,isDelegate),
      userCalender: getUserCalender.bind(null,uid,speciality,isDelegate),
      completedCourse: getCompletedCourse.bind(null,uid,speciality,isDelegate),
      favCourse : getFavCourse.bind(null,uid,speciality,isDelegate),
      favTools : getFavTools.bind(null,uid,speciality,isDelegate),
      ongoingEnrolled : getOngoingEnrolled.bind(null,uid,speciality,isDelegate)
    },
        function(err, results) {
          if(err)
            res.send(err);
          else{
            res.setHeader('Cache-Control', 'public, no-cache, no-store');
            res.header('Pragma', 'no-cache');
            res.send(results);
          }
        });
  }
}

const getSpecialityCourses = (uid , speciality, isDelegate, callback) => {
  let query = '';
  connect().then(function(userobj){
    if(!isDelegate) 
      query = "((select cif.id, cif.name from spainschema.course_event_info cif  where cif.specialization  @> ARRAY['"+speciality+"']::varchar[] and cif.is_active = true and type='course' "+
                        "and CAST(NOW() at time zone 'utc' AS date) between cif.start_date and cif.end_date limit 3) "+
                        "UNION ALL "+
                        "(select cif.id, cif.name from spainschema.course_register cr, spainschema.course_event_info cif, spainschema.user_info ui where cif.specialization  @> ARRAY['"+speciality+"']::varchar[] and cif.is_active = true "+
                        "and cif.id = cr.cid and cr.uid = ui.uid and ui.uid = '"+uid+"' and (cif.start_date > CAST(NOW() at time zone 'utc' AS date) or cif.start_date is null) limit 3) "+
                        "UNION ALL "+
                        "(select cif.id, cif.name from spainschema.user_course_map cr, spainschema.user_info ui, spainschema.course_event_info cif where cr.uid = ui.uid and cif.id = cr.type_id and ui.uid = '"+uid+"' limit 3)) limit 3 "
    else
                query = "((select cif.id, cif.name from spainschema.course_event_info cif  where cif.is_active = true and type='course' "+
                        "and CAST(NOW() at time zone 'utc' AS date) between cif.start_date and cif.end_date limit 3) "+
                        "UNION ALL "+
                        "(select cif.id, cif.name from spainschema.course_register cr, spainschema.course_event_info cif, spainschema.user_info ui where cif.is_active = true "+
                        "and cif.id = cr.cid and cr.uid = ui.uid and ui.uid = '"+uid+"' and (cif.start_date > now() or cif.start_date is null) limit 3) "+
                        "UNION ALL "+
                        "(select cif.id, cif.name from spainschema.user_course_map cr, spainschema.user_info ui, spainschema.course_event_info cif where cr.uid = ui.uid and cif.id = cr.type_id and ui.uid = '"+uid+"' limit 3)) limit 3 "

    return executeQuery(userobj, query);
  })
        .then(function(execResult){
          callback(null,execResult.rows);
        })
        .catch(function(error){ 
          console.log(error,null);
          return "failed"
        });
}

const getUserCalender = (uid , speciality, isDelegate, callback) => {
  let query = '';
  connect().then(function(userobj){ 
    query = "(select cif.* from spainschema.user_fav_map uf, spainschema.course_event_info cif where uf.uid = '"+uid+"' and uf.type in ('event') and cif.id = uf.type_id) "+
                    "UNION ALL "+
                    "(select * from spainschema.course_event_info cif where cif.type in ('event') and cif.is_active = true and cif.end_date > CAST(NOW() at time zone 'utc' AS date) and cif.start_date > CAST(NOW() at time zone 'utc' AS date) order by cif.start_date asc) "+
                    "limit 3";
                                            
    return executeQuery(userobj, query);
  })
        .then(function(execResult){
          callback(null,execResult.rows);
        })
        .catch(function(error){ 
          console.log(error,null);
          return "failed"
        });
}

const getUserNotification = (uid , callback) => {
  let query = '';
  connect().then(function(userobj){ 
    query = "select * from spainschema.user_notification_map um, spainschema.course_event_info cef where uid = '"+uid+"' and um.type_id = cef.id order by "+
                    "CASE "+ 
                    "WHEN status = 'unseen' THEN 1 "+
                    "ELSE 2 "+
                    "END";
                                            
    return executeQuery(userobj, query);
  })
        .then(function(execResult){
          callback(execResult.rows);
        })
        .catch(function(error){ 
          console.log(error);
          return "failed"
        });
}

const getCompletedCourse = (uid , speciality, isDelegate, callback) => {
  let query = '';
  connect().then(function(userobj){ 
    query = "select cr.* , cif.* from spainschema.user_course_map cr, spainschema.user_info ui, spainschema.course_event_info cif where cr.uid = ui.uid and cif.id = cr.type_id and ui.uid = '"+uid+"' ";
                                            
    return executeQuery(userobj, query);
  })
        .then(function(execResult){
          callback(null,execResult.rows);
        })
        .catch(function(error){ 
          console.log(error,null);
          return "failed"
        });
}

const getFavCourse = (uid , speciality, isDelegate, callback) => {
  let query = '';
  connect().then(function(userobj){ 
    query = "select cif.* from spainschema.user_fav_map uf, spainschema.course_event_info cif where uf.uid = '"+uid+"' and uf.type in ('course') and "+
                    "cif.id = uf.type_id and cif.is_active = true and (cif.end_date > CAST(NOW() at time zone 'utc' AS date) or cif.end_date is null) ";
                                            
    return executeQuery(userobj, query);
  })
        .then(function(execResult){
          callback(null,execResult.rows);
        })
        .catch(function(error){ 
          console.log(error,null);
          return "failed"
        });
}

const getFavTools = (uid , speciality, isDelegate, callback) => {
  let query = '';
  connect().then(function(userobj){ 
    query = "select cif.*,uf.*  from spainschema.user_fav_map uf, spainschema.course_event_info cif where uf.uid = '"+uid+"' and uf.type in ('tool') and "+
                    "cif.id = uf.type_id and cif.is_active = true and (cif.end_date > CAST(NOW() at time zone 'utc' AS date) or cif.end_date is null)";
                                            
    return executeQuery(userobj, query);
  })
        .then(function(execResult){
          callback(null,execResult.rows);
        })
        .catch(function(error){ 
          console.log(error,null);
          return "failed"
        });
}

const getOngoingEnrolled = (uid , speciality, isDelegate, callback) => {
  let query = '';
  connect().then(function(userobj){ 
    query = "(select cif.* from spainschema.user_fav_map uf, spainschema.course_event_info cif where uf.uid = '"+uid+"' and uf.type in ('course') "+
                    "and cif.id = uf.type_id and cif.is_active = true and CAST(NOW() at time zone 'utc' AS date) between cif.start_date and cif.end_date) "+
                    "UNION "+
                    "(select cif.* from spainschema.course_register cr, spainschema.course_event_info cif where cr.uid = '"+uid+"' "+
                    "and cif.id = cr.cid and cif.is_active = true and (cif.end_date > CAST(NOW() at time zone 'utc' AS date) or cif.end_date is null))";
                                            
    return executeQuery(userobj, query);
  })
        .then(function(execResult){
          callback(null,execResult.rows);
        })
        .catch(function(error){ 
          console.log(error,null);
          return "failed"
        });
}

module.exports = {
  addNotification,
  getUserNotification,
  addNotificationBatch,
  getProfileInfo
}
