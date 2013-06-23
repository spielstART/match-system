var models = require('../models');
var async = require("async");

//get
exports.tournamentlist = function(req, res) {
  models.Tournament.find().exec(function(err, tournament) {
    if (err) {
      throw err;
    } else {
      res.render('tournamentlist', {title: 'Tournaments', tournaments: tournament});
    }
  });
};

exports.tournament = function(req, res) {
  var query = models.PlayerList.find();
  query.populate('player', 'username email');
  query.exec(function(err, playerlist) {
    if (err) {
      throw err;
    }

    if(req.user) {
      res.render('tournament', {title: 'Tournament', playerlist: playerlist, user: req.user});
    } else {
      res.redirect('/user/signin');
    }
    console.log(playerlist);
  });
};

//post
exports.enterTournament = function(req, res) {
  models.PlayerList.find({player: req.user._id}, function(err, user){
    if(err) {
      throw err;
    } else if (user[0] === undefined){
      var tournament = new models.PlayerList({player: req.user._id});
      tournament.save(function (err) {
        if (err) {
          throw err;
        }
        console.log(req.user.username + " enrolled in tournament!");
        res.redirect('/tournament');
     });
    } else{
      console.log("user already in list");
      res.redirect('/tournament');
    }
  });
};

//post
exports.leaveTournament = function(req, res) {
  models.PlayerList.find({player: req.user._id}, function(err, user) {
    if (err) {
      throw err;
    } else if (user[0] === undefined) {
      console.log("user not in list");
      res.redirect('/tournament');
    } else {
      user[0].remove(function (err){if (err) throw err;});
      console.log(req.user.username + " left the tournament!");
      res.redirect('/tournament');
    }
  });
};

//get
exports.bracket = function (req, res) {
  res.render('bracket', { title: 'Match-System', user: req.user});

  var bracketQuery = models.PlayerList.find();
  bracketQuery.select('user');
  bracketQuery.exec(function(err, user){
    if (err){
      throw err;
    } else {
      console.log(user);
      var bracketUser = user;
      console.log(bracketUser);
    }
  });

  var round = 1;
  if (placement == "winner") {
    round = round++;
    nextBracket.push(user);
    console.log(round);
  } else {
    console.log(user + "lost the round and will be kicked");
  }

  var bracketSize;
  for(var one = 0, two = 1; one <= 7; one+=2, two+=2) {
    console.log("one" + one);
    console.log("two" + two);
  }
};
