var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;
var app = express();
var session = require('express-session');
// Route implementation

//configuration
app.use(cookieParser());

app.use(bodyParser()); //calling the bodyParser function
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));
app.use(passport.initialize());
app.use(passport.session());

//mongoose stuff

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
});

//my user schema that has 4 properties
var userSchema = mongoose.Schema({
    id: String,
    name: String,
    password: String,
    profileImage: String
});

//user Model for mongoose.  going to use upper case User to define the mongoose model

var users = mongoose.model('users', userSchema);

// Passport session stuff
passport.serializeUser(function(user, done) {
  done(null, user.id);  //give an unique id to create user cookie
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);  //whose id is this user belonged to .. in the initialization, find it by user.id 
  });
});

//if in any route, u ca

function findById(id, fn) {
  for (var i=0; i<users.length; i++) {
    var user = users[i];
    if (user.id === id) {
      return fn(null, user); //first argument means no error... that's why it is null
    }
  }
  return fn(null, null);
}

//authentication middleware

function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()){
    return next();}
  return res.send(403); //403 forbidden    
}



//local strategy

passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'password'
  },
  function(username, password, done) {
        findById(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' });}
        return done(null, user);
      })

  }
));

// Users section

app.get('/api/users',
  function(req, res, next){  



    var operation = req.query.operation;
    var authenticated = req.query.authenticated;

    if(operation == 'login'){

      passport.authenticate('local', function(err, user, info) {
        if (err) { return res.send(500); }
        if (!user) { return res.send(404); } 
        req.logIn(user, function(err) {
          return res.send(200, {users: [user]});
        }); 
      })(req, res, next);
    }
    else if(authenticated == "true"){
      if(req.isAuthenticated()){
        return res.send(200, {users: [req.user]});
      }
      else{
        return res.send(200, {users: []});
      }
    }
    else{
      res.send(200, {users: users}); 
    }

  
});



app.post('/api/users', function(req, res){
  //console.log(req.body.user.id);
  var User = new users({id: req.body.user.id, password: req.body.user.password, name: req.body.user.name, profileImage: 'profile.jpg'});
  console.log(User);
  //users.push({id: req.body.user.id, password: req.body.user.password, name: req.body.user.name, profileImage: 'profile.jpg'});
  //return res.send(200, {user: users[users.length-1]});
  
  return res.send(200, {user: User});
  //mongoose route


});


app.get('/api/users/:id', function(req, res){

  for(var i=0; i < users.length; i++){
    if (users[i].id == req.params.id){
      return res.send(200, {user: users[i]});
    }
  }
    return res.send(404);    
  
});

//Posts section

app.get('/api/posts', function(req, res){
  //console.log(req.user); //if there is a sesssion establish, whenever the get is called. the user will be populated based cookie.
  res.send(200, {posts: posts});
});

//POST (create new post) //take the post object from ember and add it to the array from the backend  <-access new post needs to be req.body.post can't use param
app.post('/api/posts', ensureAuthenticated, function(req, res){
  console.log(req.body.post.author);
  console.log(req.user.id);

  if(req.user.id == req.body.post.author){ //checking if the authenticated user is the same as the author
  //console.log(req.body.date);
  //if(req.body.author == req.user)
  posts.push({id: posts.length + 1, author: req.body.post.author, body: req.body.post.body, date: req.body.post.date});
  //posts.push({id: posts.length + 1, author: 'emiy', body: 'hi testing post', date: new Date(2014,3,14,12,56,55) });
  //console.log(posts[posts.length-1]);
  return res.send(200, {post: posts[posts.length-1]});}
  else{
    return res.send(403);
  }
});

app.delete('/api/posts/:id', ensureAuthenticated, function(req,res){
  //console.log(posts[req.params.id]);
  for(var i=0; i < posts.length; i++){
    if(posts[i].id === req.params.id){
      if(req.user.id === posts[i].author){
      posts.splice(i,1);}
      else{
        return res.send(403);
      } 
      break;
    }
  }
  //console.log(posts);
  return res.send(200);
});

//logout route

app.get('/logout', function(req, res){
  
  req.logout();
  console.log(req.user);
  return res.send(200);

});

  
//PUT (update followers and following list)

var posts = [{
    id: "1",
    author: 'emily',
    body: 'Hello World!',
    date: new Date(2014,3,14,12,56,55) 
  }, {
    id: "2",
    author: 'maggie',
    body: 'Hello Maggie!',
    date: new Date(2014,5,14,12,56,55) 
  },
  {
    id: "3",
    author: 'cece',
    body: 'Hello Cece!',
    date: new Date(2014,6,14,12,56,55) 
  }
];

/**var users = [
  {
    id: "emily",
    name: "Emily Lam",
    //posts: ['1'],
    password: '1234',
    profileImage: 'profile1.jpg',
    //followers: ['maggie', 'cece'],
    //has many needs to take an array
    //following: ['cece']
  },
  {
    id: "maggie",
    name: "Maggie Lam",
    //posts: ['2'],
    password: '1234',
    profileImage: 'profile2.jpg',
    //followers: ['emily'],
    //following: ['cece']
  },
  {
    id: "cece",
    name: "Cecilia Lam",
    password: '1234',
    profileImage: 'profile3.jpg',
    //followers: ['maggie'],

    //following: ['emily']
  }

];
**/


var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

