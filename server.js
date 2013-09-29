// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
var path = require('path');

var HTTP_OK = 200,
HTTP_ERR_UNKNOWN = 500,
HTTP_ERR_NOT_FOUND = 404;

httpServer.listen(8080);

function requestHandler(req, res) {
	
	var filepath =  (req.url == '/' ? 'index.html' : '.' +req.url) ,
	fileext = path.extname(filepath); 
	console.log("Request for " + filepath+ " received.");

	fs.exists(filepath, function (f) {
		console.log(f);
		if (f) {

			fs.readFile(filepath, function (err, content) {
				if (err) {
					res.writeHead(HTTP_ERR_UNKNOWN);
					res.end();
				} else {
					res.writeHead(HTTP_OK, contentType(fileext));
					res.end(content);
				}
			});
		} else {
			res.writeHead(HTTP_ERR_NOT_FOUND);
			res.end();
		}
	});
}

function contentType(ext) {
	var ct;

	switch (ext) {
		case '.html':
		ct = 'text/html';
		break;
		case '.css':
		ct = 'text/css';
		break;
		case '.js':
		ct = 'text/javascript';
		break;
		default:
		ct = 'text/plain';
		break;
	}

	return {'Content-Type': ct};
}

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function
	function (socket) {

		console.log("We have a new client: " + socket.id);

		// When this user "send" from clientside javascript, we get a "message"
		// client side: socket.send("the message");  or socket.emit('message', "the message");
		socket.on('message', 
			// Run this function when a message is sent
			function (data) {
				console.log("message: " + data);
				
				// Call "broadcast" to send it to all clients (except sender), this is equal to
				// socket.broadcast.emit('message', data);
				socket.broadcast.send(data);
				
				// To all clients, on io.sockets instead
				// io.sockets.emit('message', "this goes to everyone");
			}
			);
		
		// When this user emits, client side: socket.emit('otherevent',some data);
		socket.on('image', function(data) {
			// Data comes in as whatever was sent, including objects
			console.log("Received: 'image' ");
			socket.broadcast.emit('image',data);
		});
		
		socket.on('flowData',function(data){
			console.log("Received: 'flowData' ");
			console.log(data);
		})
		
		socket.on('disconnect', function() {
			console.log("Client has disconnected");
		});
	}
	);


