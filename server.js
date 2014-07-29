var express = require('express');
var bodyParser = require('body-parser');
var app = express();
// Route implementation

//bodyParser code
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: false }));

// Users section

app.get('/api/users', function(req,res){
  var password = req.query.password; 
  var id = req.query.id;
  var operation = req.query.operation;
  if(operation == 'login'){
    for(var i=0; i<users.length; i++){
      if(users[i].id == id  && users[i].password == password){
        return res.send(200, {users: [users[i]]}); //remember to return an array to match the ember convention
      }
    }
      return res.send(404);
  }
  res.send(200, {users: users}); //returning all users

});

app.post('/api/users', function(req, res){
  //console.log(req.body.user.id);
  users.push({id: req.body.user.id, password: req.body.user.password, name: req.body.user.name, profileImage: 'profile.jpg'});
  return res.send(200, {user: users[users.length-1]});
  //console.log(users);
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
  res.send(200, {posts: posts});
});

//POST (create new post) //take the post object from ember and add it to the array from the backend  <-access new post needs to be req.body.post can't use param
app.post('/api/posts', function(req, res){
  console.log(req.body);
  //console.log(req.body.date);
  posts.push({id: posts.length + 1, author: req.body.post.author, body: req.body.post.body, date: req.body.post.date});
  //posts.push({id: posts.length + 1, author: 'emiy', body: 'hi testing post', date: new Date(2014,3,14,12,56,55) });
  console.log(posts[posts.length-1]);
  return res.send(200, {post: posts[posts.length-1]});
});

app.delete('/api/posts/:id', function(req,res){
  console.log(posts[req.params.id]);
  for(var i=0; i < posts.length; i++){
    if(posts[i].id === req.params.id){
      posts.splice(i,1);
      break;
    }
  }
  console.log(posts);
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

var users = [
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



var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
