const pool = require("../utils/pool");
var contenthelp = require('./content-helper');
var contentextract = require('./contentful/contentextract-controller');
var slugs = require('../../slugs.json');
var {connect,executeQuery,executeBatch} = require('./db-controller');
var socketPush = require('./socket-controller');
var cache = require('memory-cache');
var eventSchedule = require('./eventschedule-controller');



    const saveUser = (uuid , email, specialization) => {
        connect().then(function(client){
            let query ;

            query = "insert  into spainschema.user_info (uid,email,specialization,user_type) values('"+uuid+"','"+email+"','"+specialization.toLowerCase()+"','normal') ON CONFLICT DO NOTHING";
            //TODO if user is lilly user
            //query = "insert  into spainschema.user_info (uid,email,specialization,user) values('"+uuid+"','"+email+"','"+specialization.toLowerCase()+"','lilly') ON CONFLICT DO NOTHING";
            return executeQuery(client,query);
        })
        .then(function(result){
            if(result.rowCount > 0)
            {   
                loadUserNotification(uuid,function(){
                        clearNotifications(uuid);
                        if (cache.get(uuid)){
                            cache.put(uuid, 0);
                        }
                });
                socketPush.sendNotification(uuid,0);
            }
            return result;
        })
        .catch(function(error){ 
            console.log(error);
            return "failed"
        });
    }

    const loadCalendar = (callback) => {
        let calCount = 0;
        contenthelp.getPage(slugs.slugs["Calendar"].id, function (data, error) {
            if (data !== null && error === null) {
                let query = '';
                let batchQuery = [];
                const eventData = contentextract("Calendar", data);

                connect().then(function (obj) {

                    eventData.eventBox.forEach(function (upevent, index) {
                    //Add try catch for empty speciality
                    var specialization = upevent.speciality.split(',').reduce(function (prev, cur) {
                        return prev.toLowerCase().trim() + ',' + cur.toLowerCase().trim();
                    });
                             
                    query = "insert into spainschema.course_event_info (id,description,name,type,is_active,start_date,end_date,ce_type,specialization)" + " values('" + upevent.sysid + "','" + upevent.description + "','" + upevent.mainTitle + "','event','" + (upevent.isActive === true) + "','" + upevent.startDate + "','" + upevent.endDate + "','" + upevent.eventType + "','{" + specialization + "}') on conflict ON CONSTRAINT course_event_info_pkey " + "do update set description = '" + upevent.description + "',name = '" + upevent.mainTitle + "',type = 'event',is_active = '" + (upevent.isActive === true) + "',start_date='" + upevent.startDate + "',end_date='" + upevent.endDate + "',ce_type = '" + upevent.eventType + "',specialization='{" + specialization + "}' ";
                    batchQuery.push(query);

                    });
                    return executeBatch(obj, batchQuery);
                }).then(function (result) {
                        callback(result);
                
                }).catch(function (error) {
                    console.log(error);
                    callback("failed");
                });
            }
        });
    }

    const loadCourses = (callback) => {
        let crsCount = 0;
        contenthelp.getPage(slugs.slugs["coursePage"].id, function (data, error) {
           
            if (data !== null && error === null) {
                let query = '';
                let batchQuery = [];
                const eventData = contentextract("Cursos", data);
                connect().then(function (obj) {
                    eventData.courseBox.forEach(function (course, index) {
                        //Add try catch for empty speciality
                        var specialization = course.speciality.split(',').reduce(function (prev, cur) {
                            return prev.toLowerCase().trim() + ',' + cur.toLowerCase().trim();
                        });
                        query = "insert into spainschema.course_event_info (id,description,name,type,is_active,start_date,end_date,ce_type,specialization)" + " values('" + course.sysid + "','" + course.courseDescription + "','" + course.courseTitle + "','course','" + (course.isActive === true) + "','" + course.startDate + "','" + course.endDate + "','" + course.courseType + "','{" + specialization + "}') on conflict ON CONSTRAINT course_event_info_pkey " + "do update set description = '" + course.courseDescription + "',name = '" + course.courseTitle + "',type = 'course',is_active = '" + (course.isActive === true) + "',start_date='" + course.startDate + "',end_date='" + course.endDate + "',ce_type = '" + course.courseType + "',specialization='{" + specialization + "}' ";
                        batchQuery.push(query);

                    });
                    return executeBatch(obj, batchQuery);
                }).then(function (result) {
                   callback(result);
                }).catch(function (error) {
                    console.log(error);
                    callback("failed");
                });
            }
        });
    }

    const loadTools = (callback) => {
        let toolCount = 0;
        contenthelp.getPage(slugs.slugs["Herramientas"].id, function (data, error) {
           
            if (data !== null && error === null) {
                let query = '';
                let batchQuery = [];
                const toolData = contentextract("Herramientas", data);

                connect().then(function (obj) {
                    toolData.toolContent.forEach(function (tool, index) {
                        //Add try catch for empty speciality
                        var specialization = tool.speciality.split(',').reduce(function (prev, cur) {
                            return prev.toLowerCase().trim() + ',' + cur.toLowerCase().trim();
                        });
                        query = "insert into spainschema.course_event_info (id,description,name,type,is_active,specialization)" + " values('" + tool.sysid + "','" + tool.description + "','" + tool.title + "','tool','" + (tool.isActive === true) + "','{" + specialization + "}') on conflict ON CONSTRAINT course_event_info_pkey " + "do update set description = '" + tool.description + "',name = '" + tool.title + "',type = 'tool',is_active = '" + (tool.isActive === true) + "',specialization='{" + specialization + "}' ";
                        batchQuery.push(query);
                    });
                    return executeBatch(obj, batchQuery);
                }).then(function (result) {
                    callback(result);
                }).catch(function (error) {
                    console.log(error);
                    callback(error
                    //return "failed"
                    );
                });
            }
        });
    }

    const loadContentful = (callback) =>{
        loadCalendar(function(result){
            loadCourses(function(result){
                loadTools(function(result){
                    callback('Done');
                });
            });
        });

    }


    //loadUserNotification: (id,notify_type,specialization) =>{
    const loadUserNotification = (uid = null,callback) =>{    
        let query = '';

        connect().then(function(obj){
            if(uid)
                query ="select * from spainschema.user_info where uid = '"+uid+"'";
            else    
                query ="select * from spainschema.user_info";
            return executeQuery(obj,query);
        }).then(function(result){
                let userCount = 0;
                let batchQuery = [];
                connect().then(function(userobj){
                    result.rows.forEach(function(item,index){      
                        query = "insert into spainschema.user_notification_map (uid,notification_type,notification_date,notification_desc,status,action,type_id)"+
                                "(select '"+item.uid+"' as uid,type as notification_type,now() as notification_date,description as notification_desc,'unseen' as status, 'add' as action, id as type_id "+
                                "from spainschema.course_event_info as d "+
                                "where specialization  @> ARRAY['"+item.specialization.toLowerCase()+"']::varchar[]) "+
                                "on conflict ON CONSTRAINT user_notification_map_uid_type_id_action_key do NOTHING";
                        //TODO another query if user is from lilly        
                        batchQuery.push(query);
                    });
                       
                    return executeBatch(userobj, batchQuery);
                })
                .then(function(execResult){
                    
                    //if(result.rows.length === userCount){
                        console.log('Load notification Done');
                        connect().then(function(userobj){
                            if(uid)
                                query ="select count(*) as count, uid from spainschema.user_notification_map where uid = '"+uid+"' and status = 'unseen' group by uid";
                            else
                                query ="select count(*) as count, uid from spainschema.user_notification_map where  status = 'unseen' group by uid";
                            return executeQuery(userobj,query);
                        }).then(function(notify){
                            notify.rows.map(function(item){
                                if(cache.get(item.uid)){
                                    if(cache.get(item.uid) !== item.count)
                                    {
                                        cache.put(item.uid,item.count);
                                        socketPush.sendNotification(item.uid,item.count);
                                    }
                                }    
                                else{
                                    cache.put(item.uid,item.count);
                                    socketPush.sendNotification(item.uid,item.count);
                                }
                            });
                            
                            callback(execResult);
                        }).catch(function(error){ 
                            console.log(error);
                            callback(error);
                        });
                    //}    
                    
                })
                .catch(function(error){ 
                    console.log(error);
                    callback(error);
                });

        })
        .catch(function(error){ 
                console.log(error);
                return "failed"
        });

    }

    const clearNotifications = (uid) => {
        let query = '';
        connect().then(function(obj){
            query = "update spainschema.user_notification_map set status = 'seen' where uid = '"+uid+"'";
            return executeQuery(obj,query);
        })
        .then(function(result){
            if(cache.get(uid)){
                cache.put(uid,0);
            }
            socketPush.sendNotification(uid,0);
        })
        .catch(function(error){ 
            console.log(error);
            return "failed"
        });        
               
    }

    const getActiveCE = (type,callback) => {
        let query = '';
        let popularity = {};
        connect().then(function(obj){
            //this query will give both popularity and courses which are active,
            //for courses which are not yet registered, popularity will be zero
            if(type === 'course')
                query = "select id, max(count) from "+
                        "((select count, cid as id from "+
                        "(select count(*) as count ,ceagg.cid from "+
                        "(select cid from spainschema.course_register "+
                        "UNION ALL "+
                        "select cid from "+
                        "(select type_id as cid,uid from spainschema.user_fav_map "+
                        "EXCEPT "+
                        "select cid,uid from spainschema.course_register) as fil) as ceagg "+
                        "group by ceagg.cid) as temp ,spainschema.course_event_info cei where  type = '"+type+"' and temp.cid = cei.id and cei.is_active = '"+true+"' and (cei.end_date >= CURRENT_TIMESTAMP or cei.end_date is null)) "+
                        "UNION "+
                        "select 0 as count, id from spainschema.course_event_info where  type = '"+type+"' and is_active = '"+true+"'  and (end_date >= CURRENT_TIMESTAMP or end_date is null)) as final group by id";
                
            if(type === 'event' || type === 'tool')
                query = "select id, max(count) from "+
                        "((select count, cid as id from "+
                        "(select count(*) as count ,ceagg.cid from "+
                        "(select type_id  as cid from spainschema.user_fav_map) as ceagg "+
                        "group by ceagg.cid) as temp ,spainschema.course_event_info cei where  type = '"+type+"' and temp.cid = cei.id and cei.is_active = '"+true+"' and (cei.end_date >= CURRENT_TIMESTAMP or cei.end_date is null)) "+
                        "UNION "+
                        "select 0 as count, id from spainschema.course_event_info where  type = '"+type+"' and is_active = '"+true+"'  and (end_date >= CURRENT_TIMESTAMP or end_date is null)) as final group by id";
                


                return executeQuery(obj,query);
        })
        .then(function(result){
            //converting result to map of key values, so when next time using we can fetch just by 
            //giving key instead of looping
            for (var i = 0; i < result.rows.length; i++) {
                popularity[result.rows[i].id] = result.rows[i].max;
            }
           
            if (type === 'course') cache.put('course_popular', popularity, 900000);
            if (type === 'event') cache.put('event_popular', popularity, 900000);
            if (type === 'tool') cache.put('tool_popular', popularity, 900000);

            callback(result);
        })
        .catch(function(error){ 
            console.log(error);
            callback(result);
            return "failed"
        }); 

    }

    const getFavorit = (uid,type,callback) =>{
        let query = '';
        connect().then(function(obj){
            if(type === 'course')
                query = "(select uf.type_id , 'fav' as type from spainschema.user_fav_map uf "+
                        "where uf.uid = '"+uid+"' and uf.type = 'course') "+
                        "UNION ALL "+
                        "(select cr.cid ,'reg' as type from spainschema.course_register cr "+
                        "where cr.uid = '"+uid+"')";
            else
                query = "select type_id , 'fav' as type from spainschema.user_fav_map "+
                        "where uid = '"+uid+"' and type = '"+type+"'";
                return executeQuery(obj,query);
        })
        .then(function(result){
            //converting result to map of key values, so when next time using we can fetch just by 
            //giving key instead of looping
            callback(result);
        })
        .catch(function(error){ 
            console.log(error);
            callback(error);
            return "failed"
        });
    }

    const setFavorit = (uid, typeObj, type_id, callback) => {
        var query = '';
        connect().then(function (obj) {
            //this query will give both popularity and courses which are active,
            //for courses which are not yet registered, popularity will be zero
            if(typeObj.type === 'tool' && typeObj.url)
                query = "insert into spainschema.user_fav_map (uid,type,type_id, url) values ('"+uid+"','"+typeObj.type+"','"+type_id+"','"+typeObj.url+"') "+
                        "on conflict ON CONSTRAINT user_fav_map_uid_type_id_key do NOTHING";
            else
                query = "insert into spainschema.user_fav_map (uid,type,type_id) values ('"+uid+"','"+typeObj.type+"','"+type_id+"') "+
                        "on conflict ON CONSTRAINT user_fav_map_uid_type_id_key do NOTHING";
            return executeQuery(obj, query);
        }).then(function (result) {
            
            if(result.rowCount > 0){
                getActiveCE(typeObj.type,function(){});
                if(typeObj.type === 'event' && typeObj.eventDate)
                {   
                    //redisSchedule.mail_schedule(uid, typeObj.eventDate, type_id);
                    eventSchedule.add_schedule(uid, typeObj.eventDate, type_id);
                }
            }
            callback(result);
        }).catch(function (error) {
            console.log(error);
            callback(error);
            return "failed";
        });
    }

    const setScore = (req , res) => {
        var query = '';

        if(req.body.uid && req.body.score && req.body.status &&  req.body.cid){
            let evalObj = {};
	    var today = new Date();
            var date_performed = today.getMonth()+'-'+today.getDate()+'-'+today.getFullYear();
            evalObj.uid = req.body.uid;
            evalObj.score = req.body.score;
            evalObj.status = req.body.status;
            evalObj.cid = req.body.cid;
            evalObj.credits = req.body.credits || 0;
            evalObj.accredited = req.body.accredited ? (req.body.accredited.toLowerCase() === 'yes' ? true : false) : false;
            connect().then(function (obj) {
                query = "insert into spainschema.user_course_map (uid,score,status,type_id,date_performed,credits,accredited) values ('"+evalObj.uid+"','"+evalObj.score+"','"+evalObj.status+"','"+evalObj.cid+"','"+ date_performed +"',"+ parseInt(evalObj.credits) +",'"+evalObj.accredited+"') "+
                        "on conflict ON CONSTRAINT user_course_map_uid_type_id_key do NOTHING";
                return executeQuery(obj, query);
            }).then(function (result) {
                
                res.send('Done');
            }).catch(function (error) {
                console.log(error);
                res.send(error);
                return "failed";
            });
        }
    }

    const courseRegister = (uid, timeStamp ,cid, callback) => {
        var query = '';
        connect().then(function (obj) {
            //this query will give both popularity and courses which are active,
            //for courses which are not yet registered, popularity will be zero
            query = "insert into spainschema.course_register (uid,registration,cid) values ('"+uid+"','"+timeStamp+"','"+cid+"') "+
                    "on conflict ON CONSTRAINT course_register_uid_cid_key do NOTHING";
            return executeQuery(obj, query);
        }).then(function (result) {
            //converting result to map of key values, so when next time using we can fetch just by 
            //giving key instead of looping
            if(result.rowCount > 0)
                getActiveCE(type,function(){});
            callback(result);
        }).catch(function (error) {
            console.log(error);
            callback(error);
            return "failed";
        });
    }

   const modifyCourseData = (type,courses,popularity,fav,reg,options = {},search = false,isHome,callback) => {
        let courseData = [];
        let box = '';

        if(type == 'course')
            box = 'courseBox';
        else if(type == 'event')
            box = 'eventBox';
        else if(type == 'tool')
            box = 'toolContent';

        courses[box].map(function(c){
                if(c.isActive){
                    if(popularity[c.sysid])
                    {   
                        let filter = false;
                        if(fav.indexOf(c.sysid)>-1)
                            c.isFavourite = true;
                        else
                            c.isFavourite = false;
                        c.popularity = Number(popularity[c.sysid]);

                        if(type === 'course')
                            if(reg.indexOf(c.sysid)>-1)
                                c.isRegistered = true;
                            else
                                c.isRegistered = false;

                        c.popularity = Number(popularity[c.sysid]);
                        
                        if(search){
                            if(options.courseType && options.courseType.toLowerCase() !== c.courseType.toLowerCase())
                                filter = true;
                            if(options.eventType && options.eventType.toLowerCase() !== c.typeOfEvent.toLowerCase())
                                filter = true;
                            if(options.keyword) {
                                if ((c.courseTitle.toLowerCase().indexOf(options.keyword.toLowerCase()) >= 0 || c.courseDescription.toLowerCase().indexOf(options.keyword.toLowerCase()) >= 0)) 
                                {   if(!filter) 
                                        filter = false;
                                }    
                                else
                                    filter = true;
                            }
                            if(options.accreditation && ((options.accreditation.toLowerCase() === 'yes' && !c.officialAccreditation) || (options.accreditation.toLowerCase() === 'no' && c.officialAccreditation) ))
                                filter = true;
                            if(options.city && options.city.toLowerCase() !== c.city.toLowerCase())
                                filter = true;
                            if(options.country && options.country.toLowerCase() !== c.country.toLowerCase())
                                filter = true;
                            if(options.startDate && new Date(options.startDate) >  new Date(c.startDate.split('T')[0]))
                                filter = true;
                            if(options.endDate && new Date(options.endDate) <  new Date(c.endDate.split('T')[0]))
                                filter = true;
                        }
                        if(!filter)
                            courseData.push(c);
                    }
                }
                    
        });
        //For search no need to sort.
        if(!search){

                if (type === 'event' && isHome) {
                    callback(courseData.sort(function (a, b) {
                                                return new Date(b.startDate) - new Date(a.startDate);
                                            }).sort(function(a,b){
                                                let tempA = a.showInHomePagePriority ? a.showInHomePagePriority : Infinity;
                                                let tempB = b.showInHomePagePriority ? b.showInHomePagePriority : Infinity;
                                                return tempA - tempB;
                                            }).slice(0, 3));
                }
                else if(type === 'event'){
                    callback(courseData.sort(function(a, b){
                                return new Date(b.startDate)-new Date(a.startDate)
                            }));
                }
                else
                {
                    callback(courseData.sort(function(a, b){
                                return b.popularity-a.popularity
                            }));
                }
        }
        else
            callback(courseData);

    } 



module.exports = {
    saveUser,
    loadContentful,
    loadUserNotification,
    getActiveCE,
    getFavorit,
    setFavorit,
    courseRegister,
    setScore,
    modifyCourseData,
    clearNotifications
}
