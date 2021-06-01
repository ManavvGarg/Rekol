const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
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
  
  dailyTasks: {
    type: Array, 
    default: []
  },
  
  weeklyTasks: {
    type: Array, 
    default: []
  }
});

const tasks = mongoose.model('tasks', taskSchema);

module.exports = tasks;
