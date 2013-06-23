var mongoose = require('mongoose');

//database connection
mongoose.connect('mongodb://localhost/matchsystem');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

exports.db = db;
