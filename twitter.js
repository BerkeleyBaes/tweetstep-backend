var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Twit = require('twit')

var T = new Twit({
    consumer_key:         'HEL8XE9rzMJOk5ZjZShSnFt3s'
  , consumer_secret:      'o16TD1T3QedgiKN3MrQaX3xMzRzFFqkorqicEBG4lmpw40qWw5'
  , access_token:         '2347949490-DjgrORJsLhCMILo0Kv9CygVVyYFAzLjSZ6sVZ7d'
  , access_token_secret:  '0uhXKJrlY8H12WtmMH1CnXPdqCjnmRETWYIg9cZV4fDCI'
})
var moodFilter = ['happy', 'sad', 'angry', 'chill', 'swag']
var assFilter = ['white', 'black', 'big', 'small', 'hairy']
var dickFilter = ['white', 'black', 'big', 'small', 'hairy']
var titsFilter = ['white', 'black', 'big', 'small', 'hairy']

var stream = T.stream('statuses/filter', {track : "filler"});
stream.stop();

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

io.sockets.on('connection', function (socket) {
    socket.broadcast.emit('update', socket['id']);
    console.log('connected' + socket['id']);

    socket.on('moods', function (data) {
      stream.stop();
      stream.params.track = moodFilter;
      stream.start();
    });

    socket.on('dicks', function (data) {
      stream.stop();
      stream.params.track = dickFilter;
      stream.start();
    });

    socket.on('ass', function (data) {
      stream.stop();
      stream.params.track = assFilter;
      stream.start();
    });

  socket.on('tits', function (data) {
      stream.stop();
      stream.params.track = titsFilter;
      stream.start();
    });

    socket.on('disconnect', function () {
        socket.broadcast.emit('disappear', socket['id']);
        console.log(socket['id'] + ' has disconnected!');
    });
});

stream.on('tweet', function (tweet) {
      io.emit('update',tweet);
      console.log('stream');
});