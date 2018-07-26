// src/config/index.js
require('dotenv').config();

module.exports = {
  appName: 'LensReview',
  port: 1234,
  db: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host:     process.env.DB_HOST,
    dbName:   process.env.DB_NAME,
  },
};
