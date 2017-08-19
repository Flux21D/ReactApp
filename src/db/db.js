"use strict";

const mysql = require("mysql");
const sqlConfigs = require("../configs/sql");

const db = new mysql.createConnection(sqlConfigs);

module.exports = db;