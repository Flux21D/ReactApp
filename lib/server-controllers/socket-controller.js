'use strict';

var cache = require('memory-cache');
var io = null;

var initSocket = function initSocket(app) {
	//var http = require('http').Server(app);
	io = require('socket.io').listen(app);

	io.on('connection', function (socket) {
		console.log('a user connected');
		socket.on('uuid', function (uuid) {
			socket.join(uuid, function () {
				console.log('rooms', socket.rooms); // here you'll see two rooms: one with socket.id and another with data.newroom
				console.log(cache.get(uuid));
				if (cache.get(uuid)) socket.emit('count', cache.get(uuid));
			});
		});

		socket.on('disconnect', function () {
			console.log('List of rooms');
			// socket.rooms.forEach(function(room){
			//io.in(room).emit('user:disconnect', {id: socket.id});
			console.dir(socket.rooms);
			//});
		});
	});
};

var sendNotification = function sendNotification(uid, count) {
	io.sockets.in(uid).emit('count', count);
};

module.exports = {
	initSocket: initSocket,
	sendNotification: sendNotification
};