const pool = require("../utils/pool");
var contenthelp = require('./content-helper');
var contentextract = require('./contentful/contentextract-controller');
var slugs = require('../../slugs.json');
var {connect,executeQuery,executeBatch} = require('./db-controller');
var socketPush = require('./socket-controller');
var cache = require('memory-cache');
var eventSchedule = require('./eventschedule-controller');
var profile = require('./myprofile-controller');
var send = require('./sendgrid-controller');

    const saveUser = (uuid , email, specialization, userType) => {
        connect().then(function(client){
            let query ;

            query = "insert  into spainschema.user_info (uid,email,specialization,user_type) values('"+uuid+"','"+email+"','"+specialization.toLowerCase()+"','"+userType+"') ON CONFLICT DO NOTHING";
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
                    
                    query = "insert into spainschema.course_event_info (id,description,name,type,is_active,start_date,end_date,ce_type,specialization)" + " values('" + upevent.sysid + "','" + upevent.description + "','" + upevent.mainTitle + "','event','" + (upevent.isActive === true) + "','" + new Date(upevent.startDate).toISOString() + "','" + new Date(upevent.endDate).toISOString() + "','" + upevent.eventType + "','{" + specialization + "}') on conflict ON CONSTRAINT course_event_info_pkey " + "do update set description = '" + upevent.description + "',name = '" + upevent.mainTitle + "',type = 'event',is_active = '" + (upevent.isActive === true) + "',start_date='" + new Date(upevent.startDate).toISOString() + "',end_date='" + new Date(upevent.endDate).toISOString() + "',ce_type = '" + upevent.eventType + "',specialization='{" + specialization + "}' ";
                    
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

    const loadNews = (callback) => {
        let crsCount = 0;
        contenthelp.getPage(slugs.slugs["Home"].id, function (data, error) {
           
            if (data !== null && error === null) {
                let query = '';
                let batchQuery = [];
                const Home = contentextract("Home", data);
                
                connect().then(function (obj) {
                    //Home.bannerSlider.forEach(function (banner, index) {
                        //Add try catch for empty speciality
                        if(Home.bannerSlider)
                        {  
                            Home.bannerSlider.forEach(function (bannerSlider, index) {
                                bannerSlider.forEach(function (banner, index) {
                                    let specialization = banner.speciality.split(',').reduce(function (prev, cur) {
                                        return prev.toLowerCase().trim() + ',' + cur.toLowerCase().trim();
                                    });
                                    if(banner.bannerType && banner.bannerType === 'news')
                                        query = "insert into spainschema.course_event_info (id,description,name,type,is_active,ce_type,specialization)" + " values('" + banner.sysid + "','" + banner.description + "','" + banner.title + "','news',true,'news','{" + specialization + "}') on conflict ON CONSTRAINT course_event_info_pkey " + "do update set description = '" + banner.description + "',name = '" + banner.title + "',type = 'news',is_active = true , ce_type = 'news',specialization='{" + specialization + "}' ";
                                    else
                                        query = '';
                                    
                                    if(query!=='')
                                        batchQuery.push(query);
                                });
                           });    
                        }

                    //});
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
                let startDate;
                let endDate;
                connect().then(function (obj) {
                    eventData.courseBox.forEach(function (course, index) {
                        //Add try catch for empty speciality
                        var specialization = course.speciality.split(',').reduce(function (prev, cur) {
                            return prev.toLowerCase().trim() + ',' + cur.toLowerCase().trim();
                        });

                        startDate = course.startDate;
                        endDate = course.endDate;

                        if(startDate && endDate)
                            query = "insert into spainschema.course_event_info (id,description,name,type,is_active,start_date,end_date,ce_type,specialization)" + " values('" + course.sysid + "','" + course.courseDescription + "','" + course.courseTitle + "','course','" + (course.isActive === true) + "','" + new Date(startDate).toISOString() + "','" + new Date(endDate).toISOString() + "','" + course.courseType + "','{" + specialization + "}') on conflict ON CONSTRAINT course_event_info_pkey " + "do update set description = '" + course.courseDescription + "',name = '" + course.courseTitle + "',type = 'course',is_active = '" + (course.isActive === true) + "',start_date='" + new Date(startDate).toISOString() + "',end_date='" + new Date(endDate).toISOString() + "',ce_type = '" + course.courseType + "',specialization='{" + specialization + "}' ";
                        else
                            query = "insert into spainschema.course_event_info (id,description,name,type,is_active,ce_type,specialization)" + " values('" + course.sysid + "','" + course.courseDescription + "','" + course.courseTitle + "','course','" + (course.isActive === true) + "','" + course.courseType+ "','{" + specialization + "}') on conflict ON CONSTRAINT course_event_info_pkey " + "do update set description = '" + course.courseDescription + "',name = '" + course.courseTitle + "',type = 'course',is_active = '" + (course.isActive === true) + "',ce_type = '" + course.courseType + "',specialization='{" + specialization + "}' ";
                        
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
                        // var specialization = tool.speciality.split(',').reduce(function (prev, cur) {
                        //     return prev.toLowerCase().trim() + ',' + cur.toLowerCase().trim();
                        // });
                        //query = "insert into spainschema.course_event_info (id,description,name,type,is_active,specialization)" + " values('" + tool.sysid + "','" + tool.description + "','" + tool.title + "','tool','" + (tool.isActive === true) + "','{" + specialization + "}') on conflict ON CONSTRAINT course_event_info_pkey " + "do update set description = '" + tool.description + "',name = '" + tool.title + "',type = 'tool',is_active = '" + (tool.isActive === true) + "',specialization='{" + specialization + "}' ";
                        query = "insert into spainschema.course_event_info (id,description,name,type,is_active,specialization)" + " values('" + tool.sysid + "','" + tool.description + "','" + tool.title + "','tool','" + (tool.isActive === true) + "','{all}') on conflict ON CONSTRAINT course_event_info_pkey " + "do update set description = '" + tool.description + "',name = '" + tool.title + "',type = 'tool',is_active = '" + (tool.isActive === true) + "',specialization='{all}' ";
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
                    loadNews(function(result){
                        callback('Done');
                    });
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
                        // query = "insert into spainschema.user_notification_map (uid,notification_type,notification_date,notification_desc,status,action,type_id)"+
                        //         "(select '"+item.uid+"' as uid,type as notification_type,now() as notification_date,description as notification_desc,'unseen' as status, 'add' as action, id as type_id "+
                        //         "from spainschema.course_event_info as d "+
                        //         "where specialization  @> ARRAY['"+item.specialization.toLowerCase()+"']::varchar[]) "+
                        //         "on conflict ON CONSTRAINT user_notification_map_uid_type_id_action_key do NOTHING";
                        if(item.user_type == 'normal'){
                            query = "insert into spainschema.user_notification_map (uid,notification_type,notification_date,notification_desc,status,action,type_id)"+
                                    "(select '"+item.uid+"' as uid,type as notification_type,CAST(NOW() at time zone 'utc' AS date) as notification_date,description as notification_desc,'unseen' as status, 'add' as action, id as type_id "+
                                    "from spainschema.course_event_info as d "+
                                    "where specialization  @> ARRAY['"+item.specialization.toLowerCase()+"']::varchar[] and type in ('course','news')) "+
                                    "on conflict ON CONSTRAINT user_notification_map_uid_type_id_action_key do NOTHING";
                        }
                        else{
                            query = "insert into spainschema.user_notification_map (uid,notification_type,notification_date,notification_desc,status,action,type_id)"+
                                    "(select '"+item.uid+"' as uid,type as notification_type,CAST(NOW() at time zone 'utc' AS date) as notification_date,description as notification_desc,'unseen' as status, 'add' as action, id as type_id "+
                                    "from spainschema.course_event_info as d "+
                                    "where specialization  @> ARRAY[]::varchar[] and type in ('course','news')) "+
                                    "on conflict ON CONSTRAINT user_notification_map_uid_type_id_action_key do NOTHING";        
                        }
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
                        "group by ceagg.cid) as temp ,spainschema.course_event_info cei where  type = '"+type+"' and temp.cid = cei.id and cei.is_active = '"+true+"' and (cei.end_date >= CAST(NOW() at time zone 'utc' AS date) or cei.end_date is null)) "+
                        "UNION "+
                        "select 0 as count, id from spainschema.course_event_info where  type = '"+type+"' and is_active = '"+true+"'  and (end_date >= CAST(NOW() at time zone 'utc' AS date) or end_date is null)) as final group by id";
                
            if(type === 'event' || type === 'tool')
                query = "select id, max(count) from "+
                        "((select count, cid as id from "+
                        "(select count(*) as count ,ceagg.cid from "+
                        "(select type_id  as cid from spainschema.user_fav_map) as ceagg "+
                        "group by ceagg.cid) as temp ,spainschema.course_event_info cei where  type = '"+type+"' and temp.cid = cei.id and cei.is_active = '"+true+"' and (cei.end_date >= CAST(NOW() at time zone 'utc' AS date) or cei.end_date is null)) "+
                        "UNION "+
                        "select 0 as count, id from spainschema.course_event_info where  type = '"+type+"' and is_active = '"+true+"'  and (end_date >= CAST(NOW() at time zone 'utc' AS date) or end_date is null)) as final group by id";
                


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
            let batchQuery = [];
	        var today = new Date();
            var date_performed = new Date().toISOString();//today.getMonth()+'-'+today.getDate()+'-'+today.getFullYear();
            evalObj.uid = req.body.uid;
            evalObj.score = req.body.score;
            evalObj.status = req.body.status;
            evalObj.cid = req.body.cid;
            evalObj.credits = req.body.credits || 0;
            evalObj.accredited = req.body.accredited;
            evalObj.courseTitle = req.body.courseTitle || '';
            evalObj.toEmail = req.body.toEmail;

                connect().then(function (obj) {
                    //this will store only first pass marks
                    //if(evalObj.status.toLowerCase() === 'pass'){
                        // query = "insert into spainschema.user_course_map (uid,score,status,type_id,date_performed,credits,accredited) values ('"+evalObj.uid+"','"+evalObj.score+"','"+evalObj.status+"','"+evalObj.cid+"','"+ date_performed +"',"+ parseInt(evalObj.credits) +",'"+evalObj.accredited+"') "+
                        //         "on conflict ON CONSTRAINT user_course_map_uid_type_id_key do NOTHING";
                        //This query will insert if entry is not there, if entry is there and score is higher than old score then update
                        //if old score is less than new score do nothing. This query will not work if table is empty
                        query = "insert into spainschema.user_course_map (uid,status,action,type_id,accredited,score,date_performed,credits) "+
                                "(select '"+evalObj.uid+"' as uid,'"+evalObj.status+"' as status,'' as action,'"+evalObj.cid+"' as type_id,"+evalObj.accredited+" as accredited,'"+evalObj.score+"' as score,'"+ date_performed +"' as date_performed,"+parseInt(evalObj.credits)+" as credits from spainschema.user_course_map "+
                                "where (uid = '"+evalObj.uid+"' and type_id = '"+evalObj.cid+"' and "+
                                "'"+evalObj.score+"' > score) or not exists (select distinct(uid) from spainschema.user_course_map where uid = '"+evalObj.uid+"' and type_id = '"+evalObj.cid+"') "+
                                ") LIMIT 1 on conflict ON CONSTRAINT user_course_map_uid_type_id_key "+
                                "do update set score = '"+evalObj.score+"',status = '"+evalObj.status+"',accredited = "+evalObj.accredited+",date_performed = '"+ date_performed +"',credits = "+parseInt(evalObj.credits)+"";
                        
                        batchQuery.push(query);
			//This query works when table is empty.
                        query = "insert into spainschema.user_course_map (uid,status,action,type_id,accredited,score,date_performed,credits) "+
                                "select '"+evalObj.uid+"' as uid,'"+evalObj.status+"' as status,'' as action,'"+evalObj.cid+"' as type_id,"+evalObj.accredited+" as accredited,'"+evalObj.score+"' as score,'"+ date_performed +"' as date_performed,"+parseInt(evalObj.credits)+" as credits "+
                                "where not exists (SELECT * FROM spainschema.user_course_map)";
                    //}
                    
                    batchQuery.push(query);

                    query = "insert into spainschema.course_eval_info (cid,score,status) values ('"+evalObj.cid+"','"+evalObj.score+"','"+evalObj.status+"') ";
                    
                    batchQuery.push(query);
                    return executeBatch(obj, batchQuery);
                }).then(function (result) {
                    if(evalObj.status === 'pass'){
                        let mailObj = {
                            fromail: process.env.NOREPLY_EMAIL,
                            tomail: evalObj.toEmail,
                            subject: 'Course '+req.body.courseTitle+' completed',
                            message: "Subjected course has been sucessfully completed"
                        }
                        send.contactSalesRepresentative(mailObj,function(){});
                        profile.addNotification(evalObj.uid,evalObj.cid,'course','add','Course completed',function(){
                            loadUserNotification(evalObj.uid,function(){});
                        });
                    }    
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
            query = "insert into spainschema.course_register (uid,registration,cid) values ('"+uid+"','"+ new Date(timeStamp).toISOString()+"','"+cid+"') "+
                    "on conflict ON CONSTRAINT course_register_uid_cid_key do NOTHING";
            return executeQuery(obj, query);
        }).then(function (result) {
            //converting result to map of key values, so when next time using we can fetch just by 
            //giving key instead of looping
            if(result.rowCount > 0)
                getActiveCE('course',function(){});
            callback(result);
        }).catch(function (error) {
            console.log(error);
            callback(error);
            return "failed";
        });
    }

   const modifyCourseData = (typeObj,courses,popularity,fav,reg,options = {},search = false,isHome,callback) => {
        let courseData = [];
        let box = '';
        let userSpeciality = typeObj.speciality.toLowerCase();
        var delegate = typeObj.isDelegate == 'true' ? true : false;
        let isNotFilterable = false;
        if(typeObj.type == 'course')
            box = 'courseBox';
        else if(typeObj.type == 'event')
            box = 'eventBox';
        else if(typeObj.type == 'tool')
            box = 'toolContent';
        
        courses[box].map(function(c){
            isNotFilterable = delegate || (c.speciality && c.speciality.trim().toLowerCase().split(/\s*,\s*/).indexOf(userSpeciality) > -1) || (typeObj.type==='tool') || (c.speciality && c.speciality.toLowerCase() === 'all');
            if(isNotFilterable)
                if(c.isActive)
                {
                    if(popularity[c.sysid])
                    {   
                        let filter = false;
                        if(fav.indexOf(c.sysid)>-1)
                            c.isFavourite = true;
                        else
                            c.isFavourite = false;
                        c.popularity = Number(popularity[c.sysid]);

                        if(typeObj.type === 'course')
                            if(reg.indexOf(c.sysid)>-1)
                                c.isRegistered = true;
                            else
                                c.isRegistered = false;

                        c.popularity = Number(popularity[c.sysid]);
                        if(search){
                            if(options.courseType && c.courseType && options.courseType.toLowerCase() !== c.courseType.toLowerCase())
                                filter = true;
                            if(options.eventType && c.typeOfEvent && options.eventType.toLowerCase() !== c.typeOfEvent.toLowerCase())
                                filter = true;
                            if (options.keyword) {
                                if(typeObj.type === 'course'){
                                    if (c.courseTitle.toLowerCase().indexOf(options.keyword.toLowerCase()) >= 0 || c.courseDescription.toLowerCase().indexOf(options.keyword.toLowerCase()) >= 0) {
                                        if (!filter) filter = false;
                                    } else filter = true;
                                }    
                                else{
                                    if (c.mainTitle.toLowerCase().indexOf(options.keyword.toLowerCase()) >= 0 || (c.description && c.description.toLowerCase().indexOf(options.keyword.toLowerCase()) >= 0)) {
                                        if (!filter) filter = false;
                                    } else filter = true;
                                }    
                            }
                            if(options.accreditation && ((options.accreditation.toLowerCase() === 'yes' && !c.officialAccreditation) || (options.accreditation.toLowerCase() === 'no' && c.officialAccreditation) ))
                                filter = true;
                            if(options.city && c.city && options.city.toLowerCase() !== c.city.toLowerCase())
                                filter = true;
                            if(options.country && c.country && options.country.toLowerCase() !== c.country.toLowerCase())
                                filter = true;
                            if(options.startDate && new Date(options.startDate).toISOString() >  new Date(c.startDate).toISOString())
                                filter = true;
                            if(options.endDate && new Date(options.endDate).toISOString() <  new Date(c.endDate).toISOString())
                                filter = true;
                            console.log(c.mainTitle.toLowerCase());
                            console.log(new Date(options.startDate).toISOString());
                            console.log(new Date(c.startDate).toISOString());
                            console.log("--------------------");
                        }
                        if(!filter)
                            courseData.push(c);
                    }
                }
                    
        });
        //For search no need to sort.
        if(!search){

                if (typeObj.type === 'event' && isHome) {
                    callback(courseData.sort(function (a, b) {
                                                return new Date(b.startDate).toISOString() - new Date(a.startDate).toISOString();
                                            }).sort(function(a,b){
                                                let tempA = a.showInHomePagePriority ? a.showInHomePagePriority : Infinity;
                                                let tempB = b.showInHomePagePriority ? b.showInHomePagePriority : Infinity;
                                                return tempA - tempB;
                                            }).slice(0, 3));
                }
                else if(typeObj.type === 'event'){
                    callback(courseData.sort(function(a, b){
                                return new Date(b.startDate).toISOString()-new Date(a.startDate).toISOString()
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
