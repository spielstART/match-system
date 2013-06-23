var mongoose = require('mongoose');
var Schema  = mongoose.Schema;

//database connection
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log('database connection succesfull!');

    // user schema
    var userSchema = mongoose.Schema({
			username: {type: String, required: true, index: { unique: true }},
			password: {type: String, required: true},
			email: {type: String, required: true},
			registered: {type: Boolean, default: false},
			created: {type: Date, default: Date.now},
            role: { type: String, default: 'user' }
    });

    userSchema.methods.validPassword = function (password) {
      return this.password === password;
    };

    // playerlist schema
    /*var playerlistSchema = mongoose.Schema({
       player: { type: Schema.Types.ObjectId, ref: 'User' }
    });*/
    //bracket schema
    /*var bracketSchema = mongoose.Schema({
     bracket: { type: Schema.Types.ObjectId, ref: 'User'}
     });*/

    // playerlist Schema
    var playerlistSchema = mongoose.Schema({
        players: [ {type: Schema.Types.ObjectId, ref: 'Player'} ],
        round: { type: String },
        group: { type: String }
    });

    // tournament Schema
    var tournamentSchema = mongoose.Schema({
        //playerlist
        title: { type: String, required: true, index: { unique: true}},
        enroll: { type: Boolean, default: true }
    });

    // player Schema
    var playerSchema = mongoose.Schema({
        player: { type: Schema.Types.ObjectId, ref: 'User' },
        tournament: { type: Schema.Types.ObjectId, ref: 'Tournament'},
        score: { type: Number }
    });



    //models
    var User = mongoose.model('User', userSchema);
    var PlayerList = mongoose.model('PlayerList', playerlistSchema);
    //var Bracket = mongoose.model('Bracket', bracketSchema);
    var Player = mongoose.model('Player', playerSchema);
    var Tournament = mongoose.model('Tournament', tournamentSchema);

    /*var bomberman = new Tournament({
        title: 'Bomberman'
    });
    bomberman.save();*/

    exports.User = User;
    exports.PlayerList = PlayerList;
    exports.Tournament = Tournament;
    exports.Player = Player;

});

exports.db = db;
