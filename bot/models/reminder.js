const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  name: {
    type: String
  },
  
  email: {
    type: String
  },
  
  ChatID: {
    type: String, 
    default: null
  },
  
  Reminders: { 
    type: Array, 
    defualt: []
  },
  
});

const reminders = mongoose.model('reminders', reminderSchema);

module.exports = reminders;
