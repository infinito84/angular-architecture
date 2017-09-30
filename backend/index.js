var express = require('express');
var app = express();
var server = require('http').Server(app);
var cors = require('cors');
var notifier = require('node-notifier');

server.listen(8484);

app.use(cors())
app.use(express.static('dist'));

notifier.notify({
	title: 'Test',
	message: 'Server listening to: '+ server.port
});
