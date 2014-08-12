var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    id: String,
    name: String,
    password: String,
    profileImage: String,
    posts: {type: [], default: []},
    followers: {type: [], default: []},
    following: {type: [], default: []}
});

var postSchema = mongoose.Schema({
    id: String,
    author: String,
    body: String,
    date: String
});

var conn = mongoose.createConnection('mongodb://localhost/test');

conn.model('users', userSchema);
conn.model('posts', postSchema);

module.exports = conn;

