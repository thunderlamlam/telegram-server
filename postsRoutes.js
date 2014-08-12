var conn = require('./databaseConn');


var mongoose = require('mongoose');
var postOperation = exports;

//Posts section

var posts = conn.model('posts'); //upper case Post and singular for model and lowercase for object

function makeEmberPost(mongoPost){
  return {author: mongoPost.author, body: mongoPost.body, date: mongoPost.date, id : mongoPost._id};
}


postOperation.get = function(req, res){

  var ownedBy = req.query.ownedBy;
  if(ownedBy){
    posts.find({author: req.query.ownedBy}, function(err, cursor){
      var emberPostArray = [];
      cursor.forEach(function(post){
        emberPostArray.push(makeEmberPost(post));
      });
      res.send(200, {posts: emberPostArray});
    });
  }
  else{
    posts.find({}, function(err, cursor){
      var emberPostArray = [];
      cursor.forEach(function(post){
        emberPostArray.push(makeEmberPost(post));
      });
      res.send(200, {posts: emberPostArray});
    });
  }
};
//oil of olay
postOperation.edit = function(req, res){

  if(req.user.id === req.body.post.author){ 
    var Post = new posts({author: req.user.id, body: req.body.post.body, date: req.body.post.date});
    console.log(Post);
    Post.save(function(err, post){
      if(err) return res.send(500);
      return res.send(200, {post: makeEmberPost(post)});
    });
  }
  else{
    return res.send(403);
  }
};

postOperation.delete = function(req,res){
  posts.findOne({_id: req.params.id}, function(err, post) {
    if (err) return res.send(404);
    if(req.user.id === makeEmberPost(post).author){
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
