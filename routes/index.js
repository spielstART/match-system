
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Match-System' });
};

exports.tournament = function(req, res){
	res.render('tournament', {title: 'Tournament'});
}

exports.enterTournament = function(req, res){

}


exports.leaveTournament = function(req, res){

}