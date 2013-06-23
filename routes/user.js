var models = require("../models");
var mailer = require("../mailer");
var async = require("async");


exports.list = function(req, res) {
  var query = models.User.find();

  query.select('username email created');

  query.exec(function(err, users) {
    if (err) {
      throw err;
    } else {
      res.render('users', { title: "Users", users: users });
    }
  });
};

exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
};

exports.signup = function(req, res) {
  res.render('signup', {
    title: "Sign up",
    message: req.flash('error')
  });
};

exports.signin = function(req, res) {
  res.render('signin', {
    title: "Sign in",
    message: req.flash('error')
  });
};

exports.activationmail = function(req, res) {
  res.render('activationmail', {
    title: 'Match-System'
  });
};

exports.activateuser = function(req, res) {
  models.User.update({_id: req.params.id}, { $set: { registered: true}}, function(err) {
    if (err) {
      throw err;
    } else {
      console.log("User registered!");
    }
  });
  res.render('activateuser', {title: 'Match-System'});
};


// POST
exports.register = function(req, res) {
  if( req.body.username === '' || req.body.password === '' || req.body.email === '') {
    req.flash('error', 'Missing credentials');
    res.redirect('back');
  } else {
    var query = models.User.where('username').equals(req.body.username);

    query.exec(function (err, quser) {
      if (err) {
        throw err;
      } else if (quser[0] === undefined) {
        var user = new models.User({
          username: req.body.username,
          password: req.body.password,
          email: req.body.email
        });

        async.series([
          function (callback){
            user.save(function (err, user){
              if (err) {
                throw err;
              } else {
                console.log("User " + user.username + " was saved");
              }
            });

            callback(null);
          },
          function (callback) {
            async.waterfall([
              function(callback) {
                models.User.findOne({ username: req.body.username }, function(err, user) {
                  if (err) {
                    throw err;
                  }

                  callback(null, user._id);
                });
              }, function(id, callback) {
                var mailbody = "<h2>Welcome to Match-System</h2></br></br><a href='http://localhost:3000/user/activate_user/" + id +"'>Activation Link</a>";
                mailer.sendMail(req.body.email, mailbody);
                res.redirect('/user/activationmail');
                callback(null, 'done');
              }
            ]);
          }
        ]);
      } else {
        req.flash('error', 'Username already in use');
        res.redirect('back');
      }
    });
  }
};
