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

//Posts section

exports.get = function(req, res){
  //console.log(req.user); //if there is a sesssion establish, whenever the get is called. the user will be populated based cookie.
  res.send(200, {posts: posts});
};

exports.edit = function(req, res){
  console.log(req.body.post.author);
  console.log(req.user.id);

  if(req.user.id === req.body.post.author){ //checking if the authenticated user is the same as the author
  //console.log(req.body.date);
  //if(req.body.author == req.user)
  posts.push({id: posts.length + 1, author: req.body.post.author, body: req.body.post.body, date: req.body.post.date});
  //posts.push({id: posts.length + 1, author: 'emiy', body: 'hi testing post', date: new Date(2014,3,14,12,56,55) });
  //console.log(posts[posts.length-1]);
  return res.send(200, {post: posts[posts.length-1]});}
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
