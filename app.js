// The below brings in the Express module
const express = require('express');
// The below brings in the path module
const path = require('path');
// The below sets a variable to the express functions
const app = express();

// The below loads the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// The below handles a GET request for the home page ('/') (The home route)
app.get('/', function(req, res){
  let articles = [
    {
      id:1,
      title:'Article One',
      author:'Nishant Vyas',
      body:'This is article one'
    },
    {
      id:2,
      title:'Article Two',
      author:'Noleen Prasad',
      body:'This is article two'
    },
    {
      id:3,
      title:'Article Three',
      author:'Chibesa Mumba',
      body:'This is article three'
    }
  ];
  // The below takes a RESponse and renders the value in the parentheses onto the browser
  res.render('index', {
    title:'Articles',
    articles: articles
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
