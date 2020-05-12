/**
 * Connecting to database
 */
const {mongodb} = require('../config/database');
const mongoose = require('mongoose');

mongoose.connect(`mongodb://${mongodb.host}:27017/${mongodb.dbname}`, {
    dbName: mongodb.dbname,
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.Promise = require('bluebird');
mongoose.set("debug", process.env.NODE_ENV !== "production");
mongoose.connection.on("error", e => {
    console.error("MongoDB connection error", e);
    process.exit(0);
});

module.exports = { mongoose };