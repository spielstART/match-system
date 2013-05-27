var mongoose = require('mongoose');


//database connection
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log('database connection succesfull!');
	

  /**************
  ***SCHEMES*****
  **************/

	//user schema
	var userSchema = mongoose.Schema({
		username:	String,
		password:	String		
	});

	//playerlist schema
	var playerlistSchema = mongoose.Schema({
	players: [userSchema]
	});


  /**************
  ****MODELS*****
  **************/
	//models
	var User = mongoose.model('User', userSchema);
	var PlayerList = mongoose.model('PlayerList', playerlistSchema);
	
	exports.User = User;
	exports.PlayerList = PlayerList;

	
});


exports.db = db;
