// The below brings in all the neccessary modules
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// The below allows us to connect to our database
mongoose.connect('mongodb://localhost/nodekb');
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

// The below is a route for adding articles
app.get('/articles/add', function(req, res){
  res.render('add_article', {
    title:'Add Article'
  });
});

// Add Submit POST route
app.post('/articles/add', function(req, res){
  // Below we create a new article variable
  let article = new Article();
  // Now we get the form values from the /articles/add page (add_article.pug) and put it into the articles collection fields
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  // Below we save these fields and insert it into the collection
  article.save(function(err){
    // If there is an error, output the error
    if(err){
      console.log(err);
      return;
      // If not, redirect to the home page
    } else {
      res.redirect('/');
    }
  });
});

// The below sets a port on which to call localhost on in order to run our app on our browser
app.listen(3000, function(){
  console.log('Server started on port 3000...');
});
