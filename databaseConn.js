var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    id: String,
    name: String,
    password: String,
    profileImage: String,
    posts: Array,
    followers: Array,
    following: Array
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

