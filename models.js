var mongoose = require('mongoose');


var userSchema = mongoose.Schema({
  username: {type: String, required: true, index: { unique: true }},
  password: {type: String, required: true},
  email: {type: String, required: true},
  registered: {type: Boolean, default: false},
  created: {type: Date, default: Date.now},
  role: { type: String, default: 'user' },
  isAdmin: {type: Boolean, default: false}
});

userSchema.methods.validPassword = function (password) {
  return this.password === password;
};

// playerlist Schema
var playerlistSchema = mongoose.Schema({
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament'},
  players: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Player'} ],
  round: { type: String },
  group: { type: String }
});

// tournament Schema
var tournamentSchema = mongoose.Schema({
  title: {type: String, required: true, index: { unique: true}},
  open: {type: Boolean, default: true},
  users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', index: {unique: true}}]
});

tournamentSchema.methods.userInTournament = function(user) {
  var userInTournament = false;
  for(var i = 0; i < this.users.length; i++) {
    if(user._id.equals(this.users[i]._id)) {
      userInTournament = true;
      break;
    }
  }
  return userInTournament;
}

// player Schema
var playerSchema = mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
