var models = require('../models');
var async = require("async");


exports.tournamentList = function(req, res) {
  if(req.user) {
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
  } else {
    res.redirect('/user/signin');
  }
};

exports.tournamentCreate = function(req, res) {
  if(req.user) {
    if(req.method == 'POST') {
      var tournament = new models.Tournament({
        title: req.body.title,
        open: true,
        users: []
      });
      tournament.save();
      res.redirect('/tournament/list');
    } else {
      res.render('tournamentCreate', {
        title: 'Create tournament'
      });
    }
  } else {
    res.render('tournamentCreate', {
      title: 'Create tournament'
    });
  }
};

exports.tournamentDetail = function(req, res) {
  if(req.user) {
    models.Tournament.findOne({_id: req.params.id}).exec(function(err, tournament) {
      if(err) {
        throw err;
      } else {
          res.render('tournamentDetail', {title: tournament.title, tournament: tournament, user: req.user});
      }
    });
  } else {
    res.redirect('/user/signin');
  }
};

exports.tournamentEnter = function(req, res) {
  models.PlayerList.find({player: req.user._id}, function(err, user) {
    if(err) {
      throw err;
    } else if (user[0] === undefined){
      var tournament = new models.PlayerList({player: req.user._id});
      tournament.save(function (err) {
        if (err) {
          throw err;
        }
        console.log(req.user.username + " enrolled in tournament!");
        res.redirect('/tournament/'+req.params.id);
     });
    } else{
      res.redirect('/tournament/'+req.params.id);
    }
  });
};

exports.tournamentLeave = function(req, res) {
  models.PlayerList.find({player: req.user._id}, function(err, user) {
    if (err) {
      throw err;
    } else if (user[0] === undefined) {
      console.log("user not in list");
      res.redirect('/tournament/'+req.param.id);
    } else {
      user[0].remove(function (err){if (err) throw err;});
      console.log(req.user.username + " left the tournament!");
      res.redirect('/tournament/'+req.params.id);
    }
  });
};
