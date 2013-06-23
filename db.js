var mongoose = require('mongoose');

//database connection
mongoose.connect('mongodb://localhost/matchsystem');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('database connection succesfull!');
});

exports.db = db;
