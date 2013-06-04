
/*
 * GET home page.
 */
var db = require('../db');

//get
exports.index = function(req, res){
    res.render('index', { title: 'Match-System', user: req.user});
    console.log(req.user);
};

//get
exports.tournament = function(req, res) {
    var query = db.PlayerList.find();
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
	db.PlayerList.find({player: req.user._id}, function(err, user){
		if(err)
			throw err;
		else if (user[0] === undefined){
			var tournament = new db.PlayerList({player: req.user._id});
            tournament.save(function (err) {
				if (err) {
           throw err;
				}
				console.log(req.user.username + " enrolled in tournament!");
				res.redirect('/tournament');
			});
		}
		else{
			console.log("user already in list");
			res.redirect('/tournament');
		}
	});
};

//post
exports.leaveTournament = function(req, res) {
    db.PlayerList.find({player: req.user._id}, function(err, user) {
        if (err) {
            throw err;
        } else if (user[0] === undefined) {
            console.log("user not in list");
            res.redirect('/tournament');
        }
        else {
            user[0].remove(function (err){if (err) throw err;});
            console.log(req.user.username + " left the tournament!");
            res.redirect('/tournament');
        }
    });
};
