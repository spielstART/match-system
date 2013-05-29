
/*
 * GET users listing.
 */

var db = require('../db'); 
 
//get
exports.list = function(req, res){
  var userlist = 'test';
  
  db.User.find(function(err, userlist){
	if (err)
		throw err;
	else
		res.render('users', {title: 'Userlist', users: userlist, user: req.user});
  });
	
};

//get
exports.signupform = function(req, res)
{
	res.render('signupform', {title: 'Signup'});
};

//post
exports.signup = function(req, res)
{
	res.render('signup', {title: 'Match-System', username: req.body.username, password: req.body.password});
	
	
	var user = new db.User({
		username: req.body.username,
		password: req.body.password
	});
	
	user.save(function (err){
		if (err) throw err;
		console.log("user saved!");	
	});
	
};

//get
exports.login = function(req, res)
{
	res.render('login', {title: 'Login'});


}

//post
exports.userlogin = function(req,res)
{
	res.render('userlogin', {title: 'userlogin', username: req.body.username});
	console.log(req.body);

}