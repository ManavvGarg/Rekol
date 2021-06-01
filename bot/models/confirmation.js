const mongoose = require('mongoose');

const firstMessageSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  
  Contact: {
    type: String,
    required: true
  },
  
  Email: {
    type: String,
    required: true
 },

  firstMessageOnReg: {
    type: Boolean,
    required: true,
    default: false
  }


});

const firstMessage = mongoose.model('firstMessage', firstMessageSchema);

module.exports = firstMessage;