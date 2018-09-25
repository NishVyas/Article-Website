const mongoose = require('mongoose');

// User schema
const UserSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
});

// The below allows us to acces the User Schema outside this file
const User = module.exports = mongoose.model('User', UserSchema);
