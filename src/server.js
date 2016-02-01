'use strict'

var restify = require('restify')
    , C = require('config')
    , mongoose = require( 'mongoose' )
    , _ = require('lodash')
    , Logger = require('bunyan')
    , async = require('async')
    , requireFolderTree = require('require-folder-tree')
    , Utils = require('./library/Utils')


var server = restify.createServer();

//the following is imortant
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

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

// Load Models
// ----------------------------------------------------------------------------
async.auto({
    models: function(cb){
        cb( null, requireFolderTree(
                __dirname + '/models',
                {
                    flatten: true,
                    flattenPrefix: true,
                    filterFiles: /^([^_].*)\.js$/,
                    flattenCamel: true
                })
        );
    },
    load: ['models', function( cb, data ){
        cb( null, _.transform( data.models, function( result, schema, name ){
            name = Utils.toCamelCase( name.replace(/index/gi, '') ); //remove index
            result[name] = mongoose.model( name, schema );
        }));
    }]
}, function( err ){
    if( err )
        log.error('Failed loading models', err);
    log.info('Models Loaded!');
});


// Load Controllers
// ----------------------------------------------------------------------------
async.auto({
    controllers: function(cb){
        cb( null, requireFolderTree(
                __dirname + '/controllers',
                {
                    flatten: true,
                    flattenPrefix: true,
                    filterFiles: /^([^_].*)\.js$/,
                    flattenCamel: true
                })
        );
    },
    load: ['controllers', function( cb, data ){
      //console.log( data )
      async.map(_.values(data.controllers), function (controller, next) {
        //log.info('Loading Controller: %s', controller );
        new controller(server, next);

      }, function (err, result) {
        if (err) {
          log.error('Failed loading controllers', err);
          return cb(err);
        }
        log.info(result)
            cb();
        })
    }]
}, function( err ){
    if( err )
        log.error('Failed loading controllers', err);
    log.info('Controllers Loaded!');
});



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



