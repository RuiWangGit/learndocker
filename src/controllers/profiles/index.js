var mongoose = require('mongoose')
    , restify = require('restify')
    , restifyMongoose = require('restify-mongoose')
    , _ = require('lodash')
    , C = require('config')
    , Profile = mongoose.model('profile')
    , async = require('async')
    ;

var ProfileCtrl = function (server, cb) {

  var profile = restifyMongoose(Profile);

  server.get('/profiles', profile.query());
  server.post('/profiles',  function (req, res, next) {
    console.log('**********')

    console.log(req.body);
    // req.body.name = "ru";
    // req.body.age = 35;
    next();
  }, profile.insert());


 
};

module.exports = ProfileCtrl;

