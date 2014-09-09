var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Twit = require('twit');
var config = require('./config.json');
var express = require('express');

var T = new Twit({
    consumer_key:         config.consumer_key
  , consumer_secret:      config.consumer_secret
  , access_token:         config.access_token
  , access_token_secret:  config.access_token_secret
})
var happyFilter = ['happy', 'smile', 'laugh', 'win', 'joy']
var sadFilter = ['sad', 'frown', 'death', 'pain', 'low']
var angryFilter = ['angry', 'fight', 'hate', 'kill', 'punch']
var chillFilter = ['chill', 'sleep', 'relax', 'rest', 'calm']

var stream = T.stream('statuses/filter', {track : "filler"});

app.use(express.static(__dirname + '/'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
    //socket.broadcast.emit('update', socket['id']);
    stream.stop();
    console.log('connected' + socket['id']);

   	socket.on('happy', function (data) {
   		console.log('happy')
      	stream.stop();
      	stream.params.track = happyFilter;
      	stream.start();
    });

    socket.on('sad', function (data) {
   		console.log('sad')
      	stream.stop();
      	stream.params.track = sadFilter;
      	stream.start();
    });

    socket.on('angry', function (data) {
   		console.log('angry')
      	stream.stop();
      	stream.params.track = angryFilter;
      	stream.start();
    });

  socket.on('chill', function (data) {
   		console.log('chill')
      	stream.stop();
      	stream.params.track = chillFilter;
      	stream.start();
    });

	socket.on('stop', function() {
		console.log('stop');
		stream.stop();
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

    io.emit('update',{"keyword":keyword, "filter":filter});
    console.log('stream');

});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on', http.address().port);
});
