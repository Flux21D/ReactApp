'use strict';

var mysql = require('mysql');
var connection = require('../db/db.js');

module.exports = {

    checkUser: function checkUser(req, res) {
        var username = req.body.username;
        var password = req.body.password;
        console.log('username: ' + username);
        console.log('password: ' + password);
        // var query = "SELECT * FROM customer_details WHERE username='" + username + "' AND password='" + password + "'";

        // connection.connect(function (err) {
        //     if (err) {
        //         console.log('error connecting: ' + err.stack);
        //         return;
        //     }

        //     connection.query(query, function (error, results, fields) {
        //         if (error) throw error;
        //         console.log(results);
        //     });
        // });
    }
};