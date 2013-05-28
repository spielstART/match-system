
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
    // require passport & localStrategy
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , db = require('./db')
  , mongoose = require('mongoose')
  , utils = require('mongoose/lib/utils');

passport.use(new LocalStrategy(
    function(username, password, done) {
        db.User.findOne({ username: username }, function (err, user) {
            if(err) return done(err);
            if (!user) {
                return done(null, false, { message: "Incorrect username"});
            }
            if (!user.validPassword(password)) {
                return done(null, false, {message: "Incorrect password"})
            }
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    db.User.findById(id, function(err, user) {
        done(err, user);
    });
});


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
// initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



app.get('/', routes.index);
app.get('/users', user.list);
app.get('/user/signup', user.signupform);
app.get('/user/login', user.login);
app.get('/tournament', routes.tournament);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


// user post routes
app.post('/signup', user.signup);
app.post('/userlogin',
    passport.authenticate('local', { successRedirect: '/',
                                     failureRedirect: '/user/login',
                                     failureFlash: false })
    //console.log(req.user);
);


// tournament post routes
app.post('/enterTournament', routes.enterTournament);
app.post('/leaveTournament', routes.leaveTournament);





http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
