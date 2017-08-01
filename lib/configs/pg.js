"use strict";

module.exports = {
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_DATABASE || "elearning",
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASSWORD || "pramod",
  port: process.env.PG_PORT || "5432",
  ssl: process.env.PG_SSL || false,
  max: process.env.PG_MAX_POOL_CLIENTS || 50, // max number of clients in the pool
  idleTimeoutMillis: process.env.PG_REMAIN_IDLE || 30000 };