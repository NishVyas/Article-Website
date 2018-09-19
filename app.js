// The below brings in all the neccessary modules
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');

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

// The below handles a GET request for the home page ('/') (The home route)
app.get('/', function(req, res){
  // The below is passing the 'articles' collection from the nodekb database (using the article.js file)
  Article.find({}, function(err, articles){
    // If there is an error, output the error, or else render the index page
    if(err){
      console.log(err);
    } else {
      // The below will output the value of 'title' and the value in 'articles'
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

// The below sets a port on which to call localhost on in order to run our app on our browser
app.listen(3000, function(){
  console.log('Server started on port 3000...');
});
