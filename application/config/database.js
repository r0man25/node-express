require('dotenv').config();

/**
 * MongoDB configuration
 */
let mongodb = {
    host: process.env.MONGO_DB_HOST || 'localhost',
    dbname: process.env.MONGO_DB_NAME || 'express',
};

module.exports = {mongodb};