const pool = require("../utils/pool");

module.exports = {
connect : () => {
        return new Promise(
                function(resolve,reject){
                    pool.connect((err, client, done) => {
                        if (err) {
                            reject(err);
                        }
                        else
                            resolve({'client':client,'done':done});
                    });

                });
    },

executeQuery : (obj,query) => {
        return new Promise(
            function(resolve,reject){
                    obj.client.query(query, (err, result) => {
                    
                    if (err) {
                        console.log(err);
                        obj.done(err);
                        reject(err);
                    }
                    else{
                        console.log("Query execute success");
                        obj.done();
                        resolve(result);
                    }
                });

            });
        },

    executeBatch: (obj, batchQuery) => {
        return new Promise(function (resolve, reject) {
            let batchResult = [];
            batchQuery.forEach(function(query,index){
                    obj.client.query(query, function (err, result) {
                        if (err) {
                            console.log(err);
                            obj.done(err);
                            reject(err);
                        } else {
                            console.log("Query execute success");
                            if(index === batchQuery.length - 1){
                                obj.done();
                                resolve(result);
                            }    
                        }
                    });
            });
            
        });
    }

}        