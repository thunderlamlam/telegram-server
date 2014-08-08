var conn = require('./databaseConn');
var users = conn.model('users');

function findById(id, fn) {
  users.findOne({id: id}, function(err, user) {
    if (err){
      return fn(err, null);
    }
    return fn(null, user);
  });
}

module.exports = function(passport){
  passport.serializeUser(function(user, done) {
    done(null, user.id);  //give an unique id to create user cookie
  });

  passport.deserializeUser(function(id, done) {
    findById(id, function (err, user) {
      console.log("Deserialize: "+ err + user);
      done(err, user);  //whose id is this user belonged to .. in the initialization, find it by user.id 
    });
  });
}