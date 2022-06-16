// server.js

// set up ======================================================================
// get all the tools we need
//All of these files are helping to build up separation of concerns so that its easier to track its parts.
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;//port is here in case Heroku wants to use a diff port

const MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose');//Another way of connecting to the database
mongoose.set('useNewUrlParser', true);//fixes deprecation error with newer version of parser: (https://stackoverflow.com/questions/50448272/avoid-current-url-string-parser-is-deprecated-warning-by-setting-usenewurlpars)
mongoose.set('useUnifiedTopology', true);//fixes deprecation error, 



var passport = require('passport');
var flash    = require('connect-flash');//flash shows if you enter wrong password
var morgan       = require('morgan');//morgan runs with server. Logs errthing happening in application
var cookieParser = require('cookie-parser');//cookie helps you read cookies. Works w/ parser to check if still logged in.
var bodyParser   = require('body-parser');//Newer versions of express, this is kinda built in.
var session      = require('express-session');//Handles user session while logged in and when logging off.

var configDB = require('./config/database.js');//this is pulling from the object made in config.js file. It holds db url. Common way of calling files throughout program.

var db

// configuration ===============================================================
//1. passing in the URL thats coming from config.js file that was brought in using require above.
//2. Calls routes.js in require as a function. It's passing in the app, passport, db into route.js to be used.
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database //this db is coming from where the server just connected to.
  require('./app/routes.js')(app, passport, db);//again, (./app...) spits out a function and then (app, pass..) are the arguments being passed in.
}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))


app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2021b', // session secret. This makes the session unique so it's not the same as another session.
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//for this password stuff, just know what it does.

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
