var models = require('../models');
var async = require("async");


exports.tournamentList = function(req, res) {
  models.Tournament.find().exec(function(err, tournament) {
    if (err) {
      throw err;
    } else {
      res.render('tournamentList', {
        title: 'Tournament list',
        tournaments: tournament
      });
    }
  });
};

exports.tournamentDetail = function(req, res) {
  var query = models.PlayerList.find();
  query.populate('player', 'username email');
  query.exec(function(err, playerlist) {
    if (err) {
      throw err;
    }

    if(req.user) {
      res.render('tournamentDetail', {title: 'Tournament', playerlist: playerlist, tournamentId: req.params['id'], user: req.user});
    } else {
      res.redirect('/user/signin');
    }
    console.log(playerlist);
  });
};

exports.tournamentEnter = function(req, res) {
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

exports.tournamentLeave = function(req, res) {
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
