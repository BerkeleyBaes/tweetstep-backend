var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(3000);
var Twit = require('twit')

var T = new Twit({
    consumer_key:         'HEL8XE9rzMJOk5ZjZShSnFt3s'
  , consumer_secret:      'o16TD1T3QedgiKN3MrQaX3xMzRzFFqkorqicEBG4lmpw40qWw5'
  , access_token:         '2347949490-DjgrORJsLhCMILo0Kv9CygVVyYFAzLjSZ6sVZ7d'
  , access_token_secret:  '0uhXKJrlY8H12WtmMH1CnXPdqCjnmRETWYIg9cZV4fDCI'
})
var stream = T.stream('statuses/filter', {track : 'happy'})

io.on('connection', function (socket) {
    socket.broadcast.emit('update', socket['id']);
    console.log('connected' + socket['id']);

    socket.on('disconnect', function () {
        socket.broadcast.emit('disappear', socket['id']);
        console.log(socket['id'] + ' has disconnected!');
    });
});

stream.on('tweet', function (tweet) {
  io.emit('update',tweet)
});

