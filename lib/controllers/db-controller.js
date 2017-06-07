'use strict';

var pool = require("../utils/pool");

module.exports = {
    connect: function connect() {
        return new Promise(function (resolve, reject) {
            pool.connect(function (err, client, done) {
                if (err) {
                    reject(err);
                } else resolve({ 'client': client, 'done': done });
            });
        });
    },

    executeQuery: function executeQuery(obj, query) {
        return new Promise(function (resolve, reject) {
            obj.client.query(query, function (err, result) {

                if (err) {
                    console.log(err);
                    obj.done(err);
                    reject(err);
                } else {
                    console.log("Query execute success");
                    obj.done();
                    resolve(result);
                }
            });
        });
    },

    executeBatch: function executeBatch(obj, batchQuery) {
        return new Promise(function (resolve, reject) {
            var batchResult = [];
            batchQuery.forEach(function (query, index) {
                obj.client.query(query, function (err, result) {
                    if (err) {
                        console.log(err);
                        obj.done(err);
                        reject(err);
                    } else {
                        console.log("Query execute success");
                        if (index === batchQuery.length - 1) {
                            obj.done();
                            resolve(result);
                        }
                    }
                });
            });
        });
    }

};