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
var happyFilter = ['happy', 'smile', 'laugh', 'win', 'joy']
var sadFilter = ['sad', 'frown', 'death', 'pain', 'low']
var angryFilter = ['angry', 'fight', 'hate', 'kill', 'punch']
var chillFilter = ['chill', 'sleep', 'big', 'rest', 'calm']

var stream = T.stream('statuses/filter', {track : "filler"});
stream.stop();

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

io.sockets.on('connection', function (socket) {
    socket.broadcast.emit('update', socket['id']);
    console.log('connected' + socket['id']);

    socket.on('happy', function (data) {
      stream.stop();
      stream.params.track = moodFilter;
      stream.start();
    });

    socket.on('sad', function (data) {
      stream.stop();
      stream.params.track = dickFilter;
      stream.start();
    });

    socket.on('angry', function (data) {
      stream.stop();
      stream.params.track = assFilter;
      stream.start();
    });

  socket.on('chill', function (data) {
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
	var tweet_text = tweet['text'];
	var keyword = '';
	var filter = stream.params.track;

	for (var i = filter.length - 1; i >= 0; i--) {
		if (tweet_text.indexOf(filter[i]) > -1) {
			keyword = filter[i];
		};
	};

    io.emit('update',keyword);
    console.log('stream');
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on', http.address().port);
});