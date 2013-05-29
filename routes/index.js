
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
exports.tournament = function(req, res){
	

	db.PlayerList.find(function(err, playerlist)
	{
		if (err) throw err;

		if(req.user)
			res.render('tournament', {title: 'Tournament', playerlist: playerlist, user: req.user});
		else
			res.redirect('/');
    
    console.log(playerlist);
	});
}

//post
exports.enterTournament = function(req, res){
	var Bomberman = new db.PlayerList({players: req.user});
	Bomberman.save(function (err){
		if (err) throw err;
		console.log(req.user.username + " enrolled in tournament!");
		res.redirect('/tournament');
	});
  
}

//post
exports.leaveTournament = function(req, res){
  
	db.PlayerList.find({"players.username": req.user.username}, function(err, user){
		if (err) 
			throw err;
		else
			user[0].remove(function (err){if (err) throw err;});

			console.log(req.user.username + " left the tournament!");
			res.redirect('/tournament');
});
	
	

}