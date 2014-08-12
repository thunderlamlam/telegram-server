var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var userOperation = exports;
var conn = require('./databaseConn');

var users = conn.model('users');

userOperation.list = function(req, res, next){  
  var operation = req.query.operation;
  var follows = req.query.follows;
  var followedBy = req.query.followedBy;
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
  else if(follows){
    console.log("first follows"+ follows);

    users.findOne({id: follows}, function(err, user){
      if (err) return res.send(500);
      if (!user) return res.send(404);
      console.log("follows:" + user.followers);
      users.find({id: user.followers}, function(err, followers){  //create a new object that only returns fields that's needed bad for bandwidth and security
        console.log("inside follows:" + followers);
        var emberFollowersArray = [];
        followers.forEach(function(user){
          emberFollowersArray.push(user);
        });
        console.log("array:" + emberFollowersArray);
        res.send(200, {users: emberFollowersArray});
      });
    });
  }
  else if(followedBy){
    
    users.findOne({id: followedBy}, function(err, user){
      if (err) return res.send(500);
      if (!user) return res.send(404);
      users.find({id: user.following}, function(err, followings){  //create a new object that only returns fields that's needed bad for bandwidth and security
        var emberFollowingsArray = [];
        followings.forEach(function(user){
          emberFollowingsArray.push(user);
        });
        res.send(200, {users: emberFollowingsArray});
      });
    });

  }
  else{
    console.log("sending ALL users authenticated response: " );

    users.find({}, function(err, cursor){
      var emberUserArray = [];
      cursor.forEach(function(user){
        emberUserArray.push(user);
      });
      res.send(200, {users: emberUserArray});
    });
  }
};

userOperation.get = function(req, res){
  users.findOne({id: req.params.id}, function(err, user) {
    if (err) return res.send(404);
    return res.send(200, {user: user});
  });  
};

userOperation.edit = function(req, res){
  var User = new users({id: req.body.user.id, password: req.body.user.password, name: req.body.user.name, profileImage: 'profile.jpg'});
  console.log(User);
  
  User.save(function (err, User){
    if (err) return res.send(500);

    req.logIn(User, function(err) {
        console.log("sending response login: " + User);
        return res.send(200, {user: User});

      }); 
  });
};

