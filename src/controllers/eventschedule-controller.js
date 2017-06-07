var send = require("./sendgrid-controller");
var {connect,executeQuery} = require('./db-controller');
var send = require("./sendgrid-controller");

function secondsToDate(secs) {
    var d = new Date();
    d.setSeconds(secs);
    return d;
}

const addSchedule = (uid,type_id,email_date) => {
	let query = '';

	connect().then(function(userobj){     
        query = "insert into spainschema.schedule_mail (uid,type_id,action,email_date,status) values ('"+uid+"','"+type_id+"','reminder','"+email_date+"','pending') "+
				"on conflict ON CONSTRAINT schedule_mail_uid_type_id_action_key do NOTHING";
                                        
                return executeQuery(userobj, batchQuery);
    })
    .then(function(execResult){
        return execResult;
    })
    .catch(function(error){ 
        console.log(error);
        return "failed"
    });

}

const updateSchedule = (uid,type_id,action) => {
	let query = '';

	connect().then(function(userobj){ 
        query = "update spainschema.schedule_mail set status = 'done' where uid = '"+uid+"' and type_id = '"+type_id+"' and action = '"+action+"'";
                                        
                return executeQuery(userobj, query);
    })
    .then(function(execResult){
        return execResult;
    })
    .catch(function(error){ 
        console.log(error);
        return "failed"
    });

}

const poll_schedule = () => {
	let query;
	connect().then(function(userobj){     
        query = "select * from  spainschema.schedule_mail sm, spainschema.user_info ui where status = 'pending' and email_date <= now() and sm.uid = ui.uid";
                                    
        return executeQuery(userobj, query);
    })
    .then(function(execResult){
    		execResult.rows.forEach(function(item){
    			send.contactSalesRepresentative(null,item.email,'event reminder');
    			updateSchedule(item.uid,item.type_id,item.action);
    		});
    	
        return execResult;
    })
    .catch(function(error){ 
        console.log(error);
        return "failed"
    });
}

module.exports = {
	add_schedule : (uid, eventDate, type_id) => {

		let diff = new Date(eventDate) - new Date();

            if(diff > 0){
              let schedule = (diff/1000) - 120; //convert to seconds and reduce 120 seconds;
              if(schedule > 0){
                //schedQueueClient.set(uid + '#' + eid, "ABC", "PX", parseInt(schedule) * 1000, redis.print);
                //TODO check schedule greater than 86400 one day
                addSchedule(uid, type_id , secondsToDate(schedule));

              }
            }  
	},

    run_scheduler : () =>{
        setInterval(function(){
            poll_schedule();
        },5000);
        

    }

}



