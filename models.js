var mongoose = require('mongoose');


var userSchema = mongoose.Schema({
  username: {type: String, required: true, index: { unique: true }},
  password: {type: String, required: true},
  email: {type: String, required: true},
  registered: {type: Boolean, default: false},
  created: {type: Date, default: Date.now},
  isAdmin: {type: Boolean, default: false}
});

userSchema.methods.validPassword = function (password) {
  return this.password === password;
};

// playerlist Schema
var playerlistSchema = mongoose.Schema({
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament'},
  players: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Player'} ],
  round: { type: Number },
  group: { type: String }
});

// tournament Schema
var tournamentSchema = mongoose.Schema({
  title: {type: String, required: true, index: { unique: true}},
  status: {type: String, default: 'open'},
  users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', index: {unique: true}}]
});

tournamentSchema.methods.userInTournament = function(user) {
  var userInTournament = false;
  for(var i = 0; i < this.users.length; i++) {
    var compareUserId = this.users[i]._id;
    if(compareUserId == undefined) {
      compareUserId = this.users[i];
    }
    if(user._id.equals(compareUserId)) {
      userInTournament = true;
      break;
    }
  }
  return userInTournament;
}

tournamentSchema.methods.startable = function() {
  return this.users.length % 2 == 0;
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
