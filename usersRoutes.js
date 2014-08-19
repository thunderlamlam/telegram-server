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
      users.find({id: {$in: user.followers}}, function(err, followers){  //create a new object that only returns fields that's needed bad for bandwidth and security
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
    console.log("first followedby"+ followedBy);
    users.findOne({id: followedBy}, function(err, user){
      if (err) return res.send(500);
      if (!user) return res.send(404);
      console.log("followed: " + user.following);
      users.find({id: {$in: user.following}}, function(err, followings){  //create a new object that only returns fields that's needed bad for bandwidth and security
        var emberFollowingsArray = [];
        console.log(followings);
        followings.forEach(function(user){
          emberFollowingsArray.push(user);
        });
        console.log("array:" + emberFollowingsArray);
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



userOperation.follow = function(req, res){  
  var followUser = req.body.followingUsername;
  users.update({id: req.user.id}, {$push: {following : followUser}},{upsert:true}, function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("Successfully added");
    }

  });
  users.update({id: followUser}, {$push: {followers : req.user.id}},{upsert:true}, function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("Successfully added");
      return res.send(200, {});
    }

  });
};

userOperation.unfollow = function(req, res){  


  var unfollowUser = req.body.unfollowingUsername;
  users.update({id: req.user.id}, {$pull: {following : unfollowUser}}, function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("Successfully removed");
    }

  });
  users.update({id: unfollowUser}, {$pull: {followers : req.user.id}}, function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("Successfully removed");
      return res.send(200, {});
     
    }

  });
};




