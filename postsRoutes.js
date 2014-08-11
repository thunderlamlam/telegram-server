var conn = require('./databaseConn');


var mongoose = require('mongoose');
var postOperation = exports;

//Posts section

var posts = conn.model('posts');

postOperation.get = function(req, res){

  var ownedBy = req.query.ownedBy;
  if(ownedBy === req.user){
    console.log("ownedBy: " + ownedBy);
    return res.send(200, {posts: []});
  }
  posts.find({}, function(err, cursor){
    var emberPostArray = [];
    cursor.forEach(function(post){
      var emberPost = {author: post.author, body: post.body, date: post.date, id : post._id};
      emberPostArray.push(emberPost);
    });
    res.send(200, {posts: emberPostArray});
  });

};
//oil of olay
postOperation.edit = function(req, res){

  if(req.user.id === req.body.post.author){ 
    var Post = new posts({author: req.user.id, body: req.body.post.body, date: req.body.post.date});
    console.log(Post);
    Post.save(function(err, Post){
      if(err) return res.send(500);
      var emberPost = {author: Post.author, body: Post.body, date: Post.date, id : Post._id};
      return res.send(200, {post: emberPost});
    });
  }
  else{
    return res.send(403);
  }
};

postOperation.delete = function(req,res){
  posts.findOne({_id: req.params.id}, function(err, Post) {
    if (err) return res.send(404);
    var emberPost = {author: Post.author, body: Post.body, date: Post.date, id : Post._id}
    
    if(req.user.id === emberPost.author){
      posts.remove({_id: req.params.id}, function (err) {
        if (err) return res.send(500);
        return res.send(200);
      });
    }
    else{
      return res.send(403);
    }
  });  
};
