var {connect,executeQuery,executeBatch} = require('./db-controller');

const TotalPlatformUsers = (uid) => {
  let query = '';
  connect().then(function(obj){
    query = "";
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