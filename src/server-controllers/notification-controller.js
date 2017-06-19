var {connect,executeQuery} = require('./db-controller');


module.exports = {

	 saveTools: (tool,callback) => {
	 	let query = '';

        connect().then(function(client){
        	let specialization = tool.fields.speciality['en-US'].split(',').reduce(function(prev,cur){
                            return prev.toLowerCase().trim()+','+cur.toLowerCase().trim();
                        });
        	
            const query =  "insert into spainschema.course_event_info (id,description,name,type,is_active,specialization)"+
                                  " values('"+tool.sys.id+"','"+tool.fields.description['en-US']+"','"+tool.fields.title['en-US']+"','tool','"+(tool.fields.isActive['en-US']===true)+"','{"+specialization+"}') on conflict ON CONSTRAINT course_event_info_pkey "+
                                  "do update set description = '"+tool.fields.description['en-US']+"',name = '"+tool.fields.title['en-US']+"',type = 'tool',is_active = '"+(tool.fields.isActive['en-US']===true)+"',specialization='{"+specialization+"}' ";
            return executeQuery(client,query);
        })
        .then(function(result){
            callback(result);
        })
        .catch(function(error){ 
            console.log(error);
            callback(error);
        });
    },

    saveCourses: (course,callback) => {
        let query = '';
            //Add try catch for empty speciality
            let specialization = course.fields.speciality['en-US'].split(',').reduce(function(prev,cur){
                            return prev.toLowerCase().trim()+','+cur.toLowerCase().trim();
                        });
                        
                        connect().then(function(obj){
                            query = "insert into spainschema.course_event_info (id,description,name,type,is_active,start_date,end_date,ce_type,specialization)"+
                                " values('"+course.sys.id+"','"+course.fields.courseDescription['en-US']+"','"+course.fields.courseTitle['en-US']+"','course','"+(course.fields.isActive['en-US']===true)+"','"+course.fields.startDate['en-US']+"','"+course.fields.endDate['en-US']+"','"+course.fields.courseType['en-US']+"','{"+specialization+"}') on conflict ON CONSTRAINT course_event_info_pkey "+
                                "do update set description = '"+course.fields.courseDescription['en-US']+"',name = '"+course.fields.courseTitle['en-US']+"',type = 'course',is_active = '"+(course.fields.isActive['en-US']===true)+"',start_date='"+course.fields.startDate['en-US']+"',end_date='"+course.fields.endDate['en-US']+"',ce_type = '"+course.fields.courseType['en-US']+"',specialization='{"+specialization+"}' ";
                            console.log(query);
                            return executeQuery(obj,query);
                        })
                        .then(function(result){
                            callback(result);
                        })
                        .catch(function(error){ 
                            console.log(error);
                            callback(error);
                        });        
                
    },

    saveEvent: (upevent,callback) => {
    	let query = '';

        let specialization = upevent.fields.speciality['en-US'].split(',').reduce(function(prev,cur){
                        return prev.toLowerCase().trim()+','+cur.toLowerCase().trim();
                    });
                        
    	connect().then(function(obj){
            query = "insert into spainschema.course_event_info (id,description,name,type,is_active,start_date,end_date,ce_type,specialization)"+
                    " values('"+upevent.sys.id+"','"+upevent.fields.description['en-US']+"','"+upevent.fields.mainTitle['en-US']+"','event','"+(upevent.fields.isActive['en-US']===true)+"','"+upevent.fields.startDate['en-US']+"','"+upevent.fields.endDate['en-US']+"','"+upevent.fields.eventType['en-US']+"','{"+specialization+"}') on conflict ON CONSTRAINT course_event_info_pkey "+
                    "do update set description = '"+upevent.fields.description['en-US']+"',name = '"+upevent.fields.mainTitle['en-US']+"',type = 'event',is_active = '"+(upevent.fields.isActive['en-US']===true)+"',start_date='"+upevent.fields.startDate['en-US']+"',end_date='"+upevent.fields.endDate['en-US']+"',ce_type = '"+upevent.fields.eventType['en-US']+"',specialization='{"+specialization+"}' ";
                return executeQuery(obj,query);
        })
        .then(function(result){
            callback(result);
        })
        .catch(function(error){ 
            console.log(error);
            callback(error);
        });
    },
    saveNews: (news,callback) => { 
        let query = '';

        let specialization = news.fields.speciality['en-US'].split(',').reduce(function(prev,cur){
                        return prev.toLowerCase().trim()+','+cur.toLowerCase().trim();
                    });

        connect().then(function(obj){
            query = "insert into spainschema.course_event_info (id,description,name,type,is_active,ce_type,specialization)" + " values('" + news.sys.id + "','" + news.fields.description['en-US'] + "','" + news.fields.title['en-US'] + "','news',true,'news','{" + specialization + "}') on conflict ON CONSTRAINT course_event_info_pkey " + 
            "do update set description = '" + news.fields.description['en-US'] + "',name = '" + news.fields.title['en-US'] + "',type = 'news',is_active = true , ce_type = 'news',specialization='{" + specialization + "}' ";    

            return executeQuery(obj,query);
        })
        .then(function(result){
            callback(result);
        })
        .catch(function(error){ 
            console.log(error);
            callback(error);
        });
    }

}	