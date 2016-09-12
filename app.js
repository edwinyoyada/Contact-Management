require('dotenv').config();

var express = require('express');
// var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var serveStatic = require('serve-static');

var db = require('./config/db');
var basicAuth = require('./middleware/BasicAuth');
var port = process.env.PORT || 8889;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(busboy());

// router.use(basicAuth.authenticate);
var contactRoute = require('./routes/ContactRoute');

app.use('/assets', serveStatic(__dirname + '/public/assets'));
app.use('/', serveStatic(__dirname + '/views'));

// app.use('/api', router);
app.use('/api', contactRoute);

//SERVER STARTS
app.listen(port);

console.log('magic in ' + port);
