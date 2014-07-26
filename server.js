var express = require('express');
var app = express();
// Route implementation


// Users
//return this.store.find('user');
//GET /api/users

app.get('/api/users', function(req,res){
  res.send(200, {users: users}); //returning all users
});


app.get('/api/users/:id', function(req, res){
  var i = 0;
  while(user = users[i++]){
    if (users[i-1].id == req.params.id){
    //console.log(users[i-1].id);
    //console.log(req.params.id);
  //users[0].id == req.params.id   //iterate through all the elemens in the array
    res.send(200, {user: users[i-1]});
    };
  };
});



//POST (create new user) //take the user from ember and add it to the array to the backend.... need to also create id to assign to the new user object


//PUT (update followers and following list)


// Posts
//return this.store.find('Post');
//GET /api/posts

app.get('/api/posts', function(req, res){
  res.send(200, {posts: posts});
});

//POST (create new post) //take the post object from ember and add it to the array from the backend  <-access new post needs to be req.body.post can't use param
app.post('/api/posts', function(req, res){
  console.log("happy");

});

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
