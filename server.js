var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var MongoStore = require('connect-mongostore')(session);
var app = express();
var usersRoutes = require('./usersRoutes');
var postsRoutes = require('./postsRoutes');
var conn = require('./databaseConn');
var passport = require('passport');
require('./auth')(passport);

//configuration
app.use(cookieParser());
app.use(bodyParser()); //calling the bodyParser function
app.use(session({ 
  secret: 'keyboard cat', 
  store: new MongoStore({'db': 'sessions'})
  //cookie: { maxAge: 60000 }
}));
app.use(passport.initialize());
app.use(passport.session());


//connect-mongostore 

var connect = require('connect');
var MongoStore = require('connect-mongostore')(session);

//mongoose stuff
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
});

//server function

function findById(id, fn) {
  users.findOne({id: id}, function(err, user) {
    if (err){
      return fn(err, null);
    }
    return fn(null, user);
  });
}

//authentication middleware
function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  return res.send(403); //403 forbidden    
}

//local strategy
passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'password'
  },
  function(username, password, done) {
        findById(username, function(err, user) {
        console.log("inside passport:" + err + user);
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password !== password) { return done(null, false, { message: 'Invalid password' });}
        console.log("inside passport callback:");
        return done(null, user);
      })

  }
));

// Users section
var users = conn.model('users');

app.get('/api/users', usersRoutes.list);
app.get('/api/users/:id', usersRoutes.get);
app.post('/api/users', usersRoutes.edit);

//Posts section
app.get('/api/posts', postsRoutes.get);
app.post('/api/posts', ensureAuthenticated, postsRoutes.edit);
app.delete('/api/posts/:id', ensureAuthenticated, postsRoutes.delete);

//logout route
app.get('/api/logout', function(req, res){  
  req.logout();
  console.log("logout");
  return res.send(200);
});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});

