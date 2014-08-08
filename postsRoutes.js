var conn = require('./databaseConn');


var mongoose = require('mongoose');
var postOperation = exports;

//Posts section

var posts = conn.model('posts');

postOperation.get = function(req, res){
  res.send(200, {posts: []});
};

postOperation.edit = function(req, res){

  if(req.user.id === req.body.post.author){ 
    var Post = new posts({id: req.user.id, author: req.user.id, body: req.body.post.body, date: req.body.post.date});
    console.log(Post);
    Post.save(function(err, Post){
      if(err) return res.send(500);
      return res.send(200, {post: Post});
    });
  }
  else{
    return res.send(403);
  }
};

postOperation.delete = function(req,res){
  //console.log(posts[req.params.id]);
  //console.log(req.body.post.author);

  console.log(req.user.id);
  console.log(req.params.id);
  //var Post = posts.findOne({''})
  if(req.user.id === req.params.author){
    posts.remove({_id: posts._id  }, function (err) {
      if (err) return res.send(500);
      return res.send(200);
    // removed!
    });
  }
  else{
    return res.send(403);
  }
  
};
