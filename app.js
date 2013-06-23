// Module dependencies.
var express = require('express'),
routes = require('./routes'),
user = require('./routes/user'),
http = require('http'),
path = require('path'),
db = require('./db'),
passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
flash = require('connect-flash');


// PASSPORT SETUP
passport.use(new LocalStrategy(
  function(username, password, done) {
  db.User.findOne({ username: username }, function (err, user) {
    if (err) { return done(err); }
    if (user) {
      if (user.registered === false){
        return done(null, false, { message: 'User not activated. Check your e-mail' });
      }
    }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!user.validPassword(password)) {
      return done(null, false, { message: 'Incorrect password.' });
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


// EXPRESS SETUP
var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

currentUser = function (req, res, next) {
  if (req.user !== undefined) {
    res.locals.currentUser = req.user;
  }
  next();
};


// Get Requests
app.get('/', currentUser, routes.index);
app.get('/users', currentUser, user.list);
//app.get('/tournament', currentUser, routes.tournament);
app.get('/tournament/:id', currentUser, routes.tournament);
app.get('/tournamentlist', currentUser, routes.tournamentlist);
app.get('/tournament/bracket', currentUser, routes.bracket);
app.get('/user/signup', currentUser, user.signup);
app.get('/user/signin', currentUser, user.signin);
app.get('/user/logout', currentUser, function(req, res){req.logout(); res.redirect('back');});
app.get('/user/activationmail', currentUser, user.activationmail);
app.get('/user/activate_user/:id', currentUser, user.activateuser);



// Post Requests
//app.post('/upload', routes.upload);
app.post('/user/register', user.register);
app.post('/enterTournament', routes.enterTournament);
app.post('/leaveTournament', routes.leaveTournament);
app.post('/user/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/signin',
  failureFlash: true
}));


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
