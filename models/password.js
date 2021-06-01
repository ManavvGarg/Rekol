const mongoose = require('mongoose');

const recoverySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  
  email: {
    type: String,
    required: true
  },

  rID: {
      type: String,
      required: true
  }

});

const recovery = mongoose.model('recovery', recoverySchema);

module.exports = recovery;
