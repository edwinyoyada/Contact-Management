require('dotenv').config();

var mongoose = require('mongoose');
var db = process.env.DB || 'mongodb://localhost/pixelhouse';
var dbOptions = { promiseLibrary: require('bluebird') };

mongoose.connect(db);
mongoose.Promise = require('bluebird');
