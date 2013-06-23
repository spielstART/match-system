// Module dependencies.
var express = require('express'),
http = require('http'),
path = require('path'),
db = require('./db'),
models = require('./models'),
passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
flash = require('connect-flash');


// PASSPORT SETUP
passport.use(new LocalStrategy(
  function(username, password, done) {
  models.User.findOne({ username: username }, function (err, user) {
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
  models.User.findById(id, function(err, user) {
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

// routes
var routes = require('./routes');
app.get('/', currentUser, routes.index);

var routesUser = require('./routes/user');
app.get('/users', currentUser, routesUser.list);
app.get('/user/signup', currentUser, routesUser.signup);
app.get('/user/signin', currentUser, routesUser.signin);
app.get('/user/logout', currentUser, routesUser.signout);
app.get('/user/activationmail', currentUser, routesUser.activationmail);
app.get('/user/activate_user/:id', currentUser, routesUser.activateuser);
app.post('/user/register', routesUser.register);
app.post('/user/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/signin',
  failureFlash: true
}));

var routesTournament = require('./routes/tournament');
app.get('/tournament/:id', currentUser, routesTournament.tournament);
app.get('/tournament/list', currentUser, routesTournament.tournamentlist);
app.get('/tournament/bracket', currentUser, routesTournament.bracket);
app.post('/enterTournament', routesTournament.enterTournament);
app.post('/leaveTournament', routesTournament.leaveTournament);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
