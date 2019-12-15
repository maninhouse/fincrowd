// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var partials = require('express-partials');
var logger = require('morgan');


// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(partials());
app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));


var port = process.env.PORT || 8080;        // set our port


app.route('/login')
    .get(function (req, res) {
        res.render('login.ejs');
    })
    .post(function (req, res) {
        console.log(req.body.data1);
        console.log(req.body.data2);
        res.send(`data1: ${req.body.data1}
        data2: ${req.body.data2}`);
        
    });


app.get('/', function (req, res) {
    res.render('index');
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Start on port ' + port);

//db
/*
var MongoStore = require('connect-mongo');
var settings = require('../simple-website-with-nodejs/settings');
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: settings.cookieSecret,
        store: new MongoStore({
            db: settings.db
        })
    }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'))
})
*/
var MongoStore = require('connect-mongo');
var settings = require('../simple-website-with-nodejs/settings');

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/animals', function(err, db) {
  if (err) {
    throw err;
  }
  db.collection('mammals').find().toArray(function(err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
  });
});
