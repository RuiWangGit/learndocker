var mongoose = require('mongoose')
    , timestamps = require('mongoose-timestamp')  
    , _ = require('lodash')
    //, autopopulate = require('mongoose-autopopulate')
    // , findOrCreate = require('mongoose-findorcreate')
    // , privatePaths = require('mongoose-private-paths')
    // , bcrypt   = require('bcrypt')
    // , C = require('config')
    ;

console.log('lllllllllll')

var ProfileSchema = new mongoose.Schema({
  name: { type: String,  required: true},
  age: {type: Number, default:1}
});



// Plugins
ProfileSchema.plugin(timestamps);
// 

//ProfileSchema.plugin(autopopulate);

module.exports = ProfileSchema;

