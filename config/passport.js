const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
  // Below is an implementation of our local Strategy
  passport.use(new LocalStrategy(function(username, password, done){
    // Match Username
    // First we create a query object for what we want to match (in this case, username)
    let query = {username:username};
    // Then we use the 'findOne' method for our User schema (we also pass in query and error)
    User.findOne(query, function(err, user){
      // If there is an error, we will just throw it here
      if(err) throw err;
      // If there is NOT a user, we return the don method with null, false, and a message object with the a string as the message
      if(!user){
        return done(null, false, {message: 'No user found'});
      }
      // If there is a user, we will skip the message abopve and move on
      // Match Password
      // We call the compare method for bcrypt which compares the password in the LocalStrategy function above, and the user password from the user above that we found from matching
      bcrypt.compare(password, user.password, function(err, isMatch){
        if(err) throw err;
        // If the passwords match, return the user
        if(isMatch){
          return done(null, user);
          // Else we will return a message object
        } else {
          return done(null, false, {message: 'Wrong Password'});
        }
      });
    });
  }));
  // The below basically set sessions once the user has been authenticated
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
