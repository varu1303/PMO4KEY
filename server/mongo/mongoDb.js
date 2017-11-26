const mongoose = require('mongoose');
const db = require('./../config/mongoUri');

mongoose.connect(db, { useMongoClient: true });

module.exports = mongoose.connection;