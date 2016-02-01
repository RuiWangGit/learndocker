'use strict'

var restify = require('restify')
    , C = require('config')
    , mongoose = require( 'mongoose' )
    , _ = require('lodash')
    , Logger = require('bunyan')


var server = restify.createServer();

console.log(C.util.getEnv('NODE_ENV'))

// Logs
// ----------------------------------------------------------------------------
var Logger = require( 'bunyan' );
global.log = new Logger( {
    name   : C.App.name,
    streams: [
        {
            stream: process.stdout
        }
    ]
});


if(C.has('Graylog2.enabled')){
    var gelfStream = require('gelf-stream');

    log.addStream({
        type: 'raw',
        stream: gelfStream.forBunyan( C.get('Graylog2.host'), C.get('Graylog2.port'))
    });
}




//console.log(C);
//console.log(global);
//-------database------
if ( !mongoose.connection.readyState ) {
  mongoose.connect(C.Mongo.host, C.Mongo.database, C.Mongo.port, C.Mongo.options, function( err) {
    if ( err ) {
      log.error('uanble to connect to MongoDB', err);
      process.exit(1);
    }
    log.info( {host: C.Mongo.host, database: C.Mongo.database }, 'MongoDB Connected!')
  })
}



//----api-----
server.get('/hello/:name', function(req, res, next){
  res.send('hello '+ req.params.name);
	next();
});


// Server
// ----------------------------------------------------------------------------

server.on('after', restify.auditLogger({
  log: log
}));

server.listen(process.env.port || 8000, function () {
  log.info('%s env %s listening at %s', process.env.NODE_ENV, server.name, server.url)
});



// server.listen(9090, function() {
// 	console.log('%s listening at %s', server.name, server.url);
// });



