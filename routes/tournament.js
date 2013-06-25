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
          user: req.user,
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
    if(req.user.isAdmin) {
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
      res.redirect('/tournament/list');
    }
  } else {
    res.redirect('/user/signin');
  }
};

exports.tournamentDetail = function(req, res) {
  if(req.user) {
    models.Tournament.findOne({_id: req.params.id}).populate('users').exec(function(err, tournament) {
      if(err) {
        throw err;
      } else {
        res.render('tournamentDetail', {
          title: tournament.title,
          tournament: tournament,
          userInTournament: tournament.userInTournament(req.user),
          user: req.user
        });
      }
    });
  } else {
    res.redirect('/user/signin');
  }
};

exports.tournamentEnter = function(req, res) {
  if(req.user) {
    models.Tournament.findOne({_id: req.params.id}, function(err, tournament) {
      if(err) {
        throw err;
      } else {
        if(tournament.userInTournament(req.user)) {
          console.log('user is already in the tournament');
        } else {
          models.Tournament.update({_id: req.params.id}, {$addToSet: {'users': req.user._id}}, function(err, data) {
            if(err) {
              throw err;
            }
          }).exec();
        }
        res.redirect('/tournament/'+req.params.id);
      }
    });
  } else {
    res.redirect('/user/signin');
  }
};

exports.tournamentLeave = function(req, res) {
  models.Tournament.findOne({_id: req.params.id, users: req.user._id}, function(err, tournament) {
    if (err) {
      throw err;
    } else {
      models.Tournament.update({_id: req.params.id}, {$pull: {'users': req.user._id}}, function(err) {
        if(err) {
          throw err;
        }
      }).exec();
    }
    res.redirect('/tournament/'+req.params.id);
  });
};
