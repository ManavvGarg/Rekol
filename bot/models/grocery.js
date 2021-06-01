const mongoose = require('mongoose');

const grocerySchema = new mongoose.Schema({
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

  Grocery: { 
    type: Array, 
    defualt: []
  },
});

const grocery = mongoose.model('grocery', grocerySchema);

module.exports = grocery;
