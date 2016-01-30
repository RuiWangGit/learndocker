'use strict'
var restify = require('restify');

var server = restify.createServer();

server.get('/hello/:name', function(req, res, next){
				res.send('hello '+ req.params.name);
				next();
});



server.listen(9090, function() {
				console.log('%s listening at %s', server.name, server.url);
});



