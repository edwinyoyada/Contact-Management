require('dotenv').config();

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 8889;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var db = require('./config/db');

var contactRoute = require('./routes/ContactRoute');

// app.use('/assets', serveStatic(__dirname + '/views/assets'));
app.use('/api', contactRoute);

// app.use('/api', router);

//SERVER STARTS
app.listen(port);

console.log('magic in ' + port);
