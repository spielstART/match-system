var mongoose = require('mongoose');
var Schema  = mongoose.Schema;

//database connection
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log('database connection succesfull!');

    //user schema
    var userSchema = mongoose.Schema({
			username: {type: String, required: true, index: { unique: true }},
			password: {type: String, required: true},
			email: {type: String, required: true},
			registered: {type: Boolean, default: false},
			created: {type: Date, default: Date.now}
    });

    userSchema.methods.validPassword = function (password) {
      return this.password === password;
    };

    //playerlist schema
    var playerlistSchema = mongoose.Schema({
       player: { type: Schema.Types.ObjectId, ref: 'User' }
    });

    //models
    var User = mongoose.model('User', userSchema);
    var PlayerList = mongoose.model('PlayerList', playerlistSchema);

    exports.User = User;
    exports.PlayerList = PlayerList;
});

exports.db = db;
