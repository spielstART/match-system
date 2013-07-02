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

exports.tournamentOpen = function(req, res) {
  if(req.user) {
    if(req.user.isAdmin) {
      models.Tournament.update({_id: req.params.id}, {status: 'open'}, function(err, data) {
        if(err) {
          throw err;
        }
      });
    }
    res.redirect('/tournament/'+req.params.id);
  } else {
    res.redirect('/user/signin');
  }
};

exports.tournamentClose = function(req, res) {
  if(req.user) {
    if(req.user.isAdmin) {
      models.Tournament.update({_id: req.params.id}, {status: 'close'}, function(err, data) {
        if(err) {
          throw err;
        }
      });
    }
    res.redirect('/tournament/'+req.params.id);
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
          status: 'open',
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
        if(tournament.status === 'run') {
          models.PlayerList.find({tournament: tournament.id}).populate('players').exec(function(err, playerList) {
            models.Player.populate(playerList, {path: 'players.user', model: models.User}, function(err, playerList) {
              res.render('tournamentDetail', {
                title: tournament.title,
                tournament: tournament,
                playerList: playerList,
                userInTournament: tournament.userInTournament(req.user),
                user: req.user
              });
            });
          });
        } else {
          res.render('tournamentDetail', {
            title: tournament.title,
            tournament: tournament,
            userInTournament: tournament.userInTournament(req.user),
            user: req.user
          });
        }
      }
    });
  } else {
    res.redirect('/user/signin');
  }
}

exports.tournamentStart = function(req, res) {
  if(req.user) {
    if(req.user.isAdmin) {
      models.Tournament.update({_id: req.params.id}, {status: 'run'}, function(err, data) {
        if(err) {
          throw err;
        } else {
          console.log("Event started");
          models.Tournament.findOne({_id: req.params.id}).exec(function(err, tournament) {
            console.log("Users:", tournament.users);
            if(tournament.users.length % 2 == 0) {
              for(var i = 0, j = 1; i < tournament.users.length; j++) {
                var player1 = models.Player({
                  user: tournament.users[i++], score: 0
                });
                player1.save();
                var player2 = models.Player({
                  user: tournament.users[i++], score: 0
                });
                player2.save();

                var playerList = models.PlayerList({
                  tournament: tournament._id,
                  players: [player1, player2],
                  round: 1,
                  group: "Group " + j
                });
                playerList.save();

                console.log(playerList);
              }
            } else {
              console.log("Invalid number of players for this tournament to start.");
            }
          });
        }
      });
    }
    res.redirect('/tournament/'+req.params.id);
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
        if(tournament.status == 'open') {
          if(tournament.userInTournament(req.user)) {
            console.log('user is already in the tournament');
          } else {
            models.Tournament.update({_id: req.params.id}, {$addToSet: {'users': req.user._id}}, function(err, data) {
              if(err) {
                throw err;
              }
            }).exec();
          }
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
      if(tournament.status == 'open') {
        models.Tournament.update({_id: req.params.id}, {$pull: {'users': req.user._id}}, function(err) {
          if(err) {
            throw err;
          }
        }).exec();
      }
    }
    res.redirect('/tournament/'+req.params.id);
  });
};

exports.tournamentScore = function(req, res) {
  if(req.user && req.user.isAdmin) {
    models.Player.findOne({_id: req.body.id}).exec(function(err, player) {
      if(err) {
        throw error;
      }
      var value = parseInt(req.body.value);
      if(Math.abs(value) === 1 && player.score + value >= 0) {
        player.score += value;
        player.save();

        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end("" + player.score);
      } else {
        res.writeHead(500);
        res.end();
      }
    });
  }
};
