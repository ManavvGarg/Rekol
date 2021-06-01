const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  
  email: {
    type: String,
    required: true
  },
  
  ChatID: {
    type: String, 
    default: null
  },

  notes: {
    type: Array,
    default: []
  }
});

const notes = mongoose.model('notes', noteSchema);

module.exports = notes;
