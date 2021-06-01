const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  
  email: {
    type: String,
    required: true
  },
  
  emailVerification: {
    type: String,
    required: true
  },
  
  emailVerificationBoolean: {
    type: Boolean,
    required: true,
    default: false
  },
  
  password: {
    type: String,
    required: true
  },
  
  Contact: {
    type: String,
    required: true
  },
  
  country: {
    type: String,
    required: true
  },
  
  countryCode: {
    type: String,
    required: true
  },
  
  timezone: {
    type: String,
    required: true
  },
  
  ChatID: {
    type: String, 
    default: null
  }
  
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
