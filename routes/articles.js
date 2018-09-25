const express = require('express');
const router = express.Router();

// Bring in the models pages (route for the models)
let Article = require('../models/article');
let User = require('../models/user');

// The below is a route for adding articles
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_article', {
    title:'Add Article'
  });
});

// Add Submit POST route
router.post('/add', function(req, res){
  // Below we are requesting to check the input with the name 'title' with the message followed after with the rule 'notEmpty' followed after
  req.checkBody('title', 'Title is required').notEmpty();
  // req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();
  // If there is an error, re-render the 'add_article.pug' with the error that was caught
  if(errors){
    res.render('add_article', {
      title:'Add Article',
      errors:errors
    });
  } else {
    // Below we create a new article variable
    let article = new Article();
    // Now we get the form values from the /articles/add page (add_article.pug) and put it into the articles collection fields
    article.title = req.body.title;
    // Instead of an arbitrary author, we will store the id of the user
    article.author = req.user._id;
    article.body = req.body.body;
    // Below we save these fields and insert it into the collection
    article.save(function(err){
      // If there is an error, output the error
      if(err){
        console.log(err);
        return;
        // If not, redirect to the home page
      } else {
        // Else, we request a flash message (gotten from express messages) and then redirect
        req.flash('success', 'Article Added');
        res.redirect('/');
      }
    });
  }
});

// The below is a route for loading the Edit form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  // We use 'Article' here since we are using the model (schema we created)
  // To get id that is in the url when we click an article link, we use req.params.id
  Article.findById(req.params.id, function(err, article){
    // If the id of the author of the article does not match the id of the user that is currently logged in, send a message and redirect to the home page
    if(article.author != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    } else {
      // Upon clicking the 'Edit' button, it will render the 'article.pug' file
      res.render('edit_article', {
        title:'Edit Article',
        article:article
      });
    }
  });
});

// Update Submit POST route
router.post('/edit/:id', function(req, res){
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
      req.flash('success', 'Article Updated');
      res.redirect('/');
    }
  });
});

// The below is a route for deleting articles
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }
  // Below we create a query where the '_id' is equal to the ':id' we requested from above
  let query = {_id:req.params.id}
  // We use the findById method and pass in the id from the url with a function
  Article.findById(req.params.id, function(err, article){
    // If the article author id is not the same as the user's id thats logged in, send a 500 error
    if(article.author != req.user._id){
      res.status(500).send();
      // Else we can remove
    } else {
      // Then, using the 'Article' schema, we remove the article based on the query
      Article.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

// The below is for creating a route for getting single articles
// The ':id' is a placeholder and can be anything
router.get('/:id', function(req, res){
  // We use 'Article' here since we are using the model (schema we created)
  // To get id that is in the url when we click an article link, we use req.params.id
  Article.findById(req.params.id, function(err, article){
    // We use the findById method from User schema and pass in article.author since thats the variable that holds the id
    User.findById(article.author, function(err, user){
      // Upon clicking the specific article, it will render the 'article.pug' file
      res.render('article', {
        article:article,
        author: user.name
      });
    });
  });
});

// Access Control
// We can pass in this function to any routes above that we want to protect
// Once passed in, users can no longer acces the page directly from the URL
function ensureAuthenticated(req, res, next){
  // If the request is authenticated, then we can move on (possible with passport)
  if(req.isAuthenticated()){
    return next();
    // Else we send a message and redirect
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
