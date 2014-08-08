var mongoose = require('mongoose');

//post schedma 
var postSchema = mongoose.Schema({
    id: String,
    author: String,
    body: String,
    date: String
});
//post model for mongoose
var posts = mongoose.model('posts', postSchema);

//Posts section

exports.get = function(req, res){
  //console.log(req.user); //if there is a sesssion establish, whenever the get is called. the user will be populated based cookie.
  //res.send(200, {posts: posts});
  res.send(200, {posts: []});
};

exports.edit = function(req, res){
  console.log(req.body.post.author);
  console.log(req.user.id);

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

exports.delete = function(req,res){
  //console.log(posts[req.params.id]);
  for(var i=0; i < posts.length; i++){
    if(posts[i].id === req.params.id){
      if(req.user.id === posts[i].author){
        posts.splice(i,1);
      }
      else{
        return res.send(403);
      } 
      break;
    }
  }
  //console.log(posts);
  return res.send(200);
};
