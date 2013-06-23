var mongoose = require('mongoose');


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

// playerlist Schema
var playerlistSchema = mongoose.Schema({
  players: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Player'} ],
  round: { type: String },
  group: { type: String }
});

// tournament Schema
var tournamentSchema = mongoose.Schema({
  title: {type: String, required: true, index: { unique: true}}
});

// player Schema
var playerSchema = mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament'},
  score: { type: Number }
});

//models
var User = mongoose.model('User', userSchema);
var PlayerList = mongoose.model('PlayerList', playerlistSchema);
var Player = mongoose.model('Player', playerSchema);
var Tournament = mongoose.model('Tournament', tournamentSchema);

exports.User = User;
exports.PlayerList = PlayerList;
exports.Tournament = Tournament;
exports.Player = Player;
