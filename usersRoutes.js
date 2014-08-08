var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

//my user schema that has 4 properties
var userSchema = mongoose.Schema({
    id: String,
    name: String,
    password: String,
    profileImage: String
});
//user Model for mongoose.  going to use upper case User to define the mongoose model
var users = mongoose.model('users', userSchema);

exports.findId = function findById(id, fn) {
  users.findOne({id: id}, function(err, user) {
    if (err){
      return fn(err, null);
    }
    return fn(null, user);
  });
}

exports.list = function(req, res, next){  
  var operation = req.query.operation;
  var authenticated = req.query.authenticated;
  console.log("operation: " + operation);
  if(operation === 'login'){
    passport.authenticate('local', function(err, user, info) {
      console.log("vlad passport response: " + err+ user + info);
      if (err) { return res.send(500); }
      if (!user) { console.log("user not found:"+user); return res.send(404); } 
      console.log("preparing to login" + user);
      req.logIn(user, function(err) {
        console.log("sending response login: " + user);
        return res.send(200, {users: [user]});

      }); 
    })(req, res, next);
  }
  else if(authenticated === "true"){
    if(req.isAuthenticated()){
      console.log("sending authenticated response: " );
      return res.send(200, {users: [req.user]});
    }
    else{
      console.log("sending NO user authenticated response: " );
      return res.send(200, {users: []});
    }
  }
  else{
    console.log("sending ALL users authenticated response: " );
      //res.send(200, {users: users});    
    return res.send(200, {users: []});
  }
};

exports.get = function(req, res){
  users.findOne({id: req.params.id}, function(err, user) {
    if (err) return res.send(404);
    return res.send(200, {user: user});
  });  
};

exports.edit = function(req, res){
  var User = new users({id: req.body.user.id, password: req.body.user.password, name: req.body.user.name, profileImage: 'profile.jpg'});
  console.log(User);
  
  User.save(function (err, User){
    if (err) return res.send(500);
    return res.send(200, {user: User});
  });
};

