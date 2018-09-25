const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Bring in the User model page
let User = require('../models/user');

// The below is a GET request to the register url so that we can load a form
router.get('/register', function(req, res){
  res.render('register');
});

// Register Process
router.post('/register', function(req, res){
  // Below, we get the form values from the 'register' page and put them into variables
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;
  // Below we are requesting to check if all the inputs have been filled or match properly and if not, to output the the second string in the parameters
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match.').equals(req.body.password);
  // Below we set a variable to equal all the validation errors we encounter
  let errors = req.validationErrors();
  // If there are errors, we re-render the register page and output the errors
  if(errors){
    res.render('register', {
      errors:errors
    });
    // Else we input the user in the database
  } else {
    let newUser = new User({
      name:name,
      email:email,
      username:username,
      password:password
    });
    // The below will generate a 'salt' and give it to us
    bcrypt.genSalt(10, function(err, salt){
      // Then we call another function which hashes the password with the salt
      bcrypt.hash(newUser.password, salt, function(err, hash){
        // If error, console.log
        if(err){
          console.log(err);
        }
        // Now we set the newUser password to the hashed password
        newUser.password = hash;
        // Finally, we can use the save method to add the user to out database
        newUser.save(function(err){
          // If error, console.log
          if(err){
            console.log(err);
            return;
            // Else, we create a flash message (simialr to when we add an article) and redirect to the user/login page
          } else {
            req.flash('success','You are now registered and can log in.');
            res.redirect('/users/login');
          }
        })
      });
    });
  }
});

router.get('/login', function(req, res){
  res.render('login');
});

module.exports = router;
