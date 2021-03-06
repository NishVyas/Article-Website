// The below brings in all the neccessary modules
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

// The below allows us to connect to our database
mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Check for database errors
db.on('error', function(err){
  console.log(err);
});

// Bring in the models pages (route for the models)
let Article = require('./models/article');

// The below loads the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware for body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// The below lets express know that we are using the 'public' folder as a astatic folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session middleware (copied from express session github, but resave to 'true' and no cookieValue)
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

// Express Messages Middleware (copied from express messages github)
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport config
require('./config/passport')(passport);
// The below is just Passport Middleware copied from the passportjs.org website documentation
app.use(passport.initialize());
app.use(passport.session());

// Below we create a route for all urls and we want to enable a global user variable (the asterisk is for all routes)
app.get('*', function(req, res, next){
  // Below sets a global user variable which equals the req.user object if we are logged in
  // We only set this if there actually is a request user object (hence the || null)
  res.locals.user = req.user || null;
  next();
});

// The below handles a GET request for the home page ('/') (The home route)
app.get('/', function(req, res){
  // The below is passing the 'articles' collection from the nodekb database (using the article.js file)
  Article.find({}, function(err, articles){
    // If there is an error, output the error, or else render the index page
    if(err){
      console.log(err);
    } else {
      // The below will pass the values in 'title' and 'articles' into the index.pug file
      res.render('index', {
        title:'Articles',
        articles: articles
      });
    }
  });
});

// Route Files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);

// The below sets a port on which to call localhost on in order to run our app on our browser
app.listen(3000, function(){
  console.log('Server started on port 3000...');
});
