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

// The below lets express know that we are using the 'public' folder as a astatic folder
app.use(express.static(path.join(__dirname, 'public')));

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

// The below is for creating a route for getting single articles
// The ':id' is a placeholder and can be anything
app.get('/article/:id', function(req, res){
  // We use 'Article' here since we are using the model (schema we created)
  // To get id that is in the url when we click an article link, we use req.params.id
  Article.findById(req.params.id, function(err, article){
    // Upon clicking the specific article, it will render the 'article.pug' file
    res.render('article', {
      article:article
    });
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

// The below is a route for loading the Edit form
app.get('/article/edit/:id', function(req, res){
  // We use 'Article' here since we are using the model (schema we created)
  // To get id that is in the url when we click an article link, we use req.params.id
  Article.findById(req.params.id, function(err, article){
    // Upon clicking the 'Edit' button, it will render the 'article.pug' file
    res.render('edit_article', {
      title:'Edit Article',
      article:article
    });
  });
});

// Update Submit POST route
app.post('/articles/edit/:id', function(req, res){
  // Below we create an empty object
  let article = {};
  // Now we get the form values from the /articles/edit page (edit_article.pug) and put it into the articles collection fields
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  // Below we create a query where the '_id' is equal to the ':id' we requested from above
  let query = {_id:req.params.id}

  // Below we save these fields and update it into the collection (but we use the schema aka 'Article')
  Article.update(query, article, function(err){
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

// The below is a route for deleting articles
app.delete('/article/:id', function(req, res){
  // Below we create a query where the '_id' is equal to the ':id' we requested from above
  let query = {_id:req.params.id}
  // Then, using the 'Article' schema, we remove the article based on the query
  Article.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.send('Success')
  });
});

// The below sets a port on which to call localhost on in order to run our app on our browser
app.listen(3000, function(){
  console.log('Server started on port 3000...');
});
