const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
var path = require("path")

//Models
const notesDB = require("./../models/notes");
const groceryDB = require("./../models/grocery");
const tasksDB = require("./../models/tasks");

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render ('welcome'));

router.get('/arc-sw.js', forwardAuthenticated, (req, res) => res.sendFile(path.join(__dirname, "../public", "arc-sw.js")));

router.get('/welcome', forwardAuthenticated, (req, res) => res.render ('welcome'));

router.get('/get-started', forwardAuthenticated, (req, res) => res.render ('welcome'));

router.get('/index', forwardAuthenticated, (req, res) => res.render ('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, async(req, res) => {

  //==================== USER NOTES ============================
  let userNotes = [];
  let userNotesLen = 0;
  // /.catch(e =>   .log(e));
  await notesDB.findOne({ ChatID: req.user.ChatID }, async(err, data) => {
    if(err) throw err;

  if(data.notes && data.notes.length > 0) {
  if(data.notes.length > 1) {
    const userNotes2 = await data.notes.sort(function(x, y){ return y.timestamp - x.timestamp });
  userNotesLen = await userNotes2.length;
  for(i=0; i<5; i++) {
    if(userNotes2[i] === undefined || userNotes2[i] === null) return;
    userNotes.push(userNotes2[i]);
  }
  } else if(data.notes.length === 1){
    const userNotes2 = await data.notes[0]
    userNotesLen = 1;
    userNotes.push(userNotes2);
  }
  }


  });

    //==================== USER Grocery ============================
    let userGrocery = [];
    let userGroceryLen = 0;
    // /.catch(e =>   .log(e));
    await groceryDB.findOne({ ChatID: req.user.ChatID }, async(err, data) => {
      if(err) throw err;
  
    if(data.Grocery && data.Grocery.length > 0) {
    if(data.Grocery.length > 1) {
    userGroceryLen = await data.Grocery.length;
    for(i=0; i<4; i++) {
      if(data.Grocery[i] === undefined || data.Grocery[i] === null) return;
      userGrocery.push(data.Grocery[i]);
    }
    } else if(data.Grocery.length === 1){
      const userGrocery2 = await data.Grocery[0]
      userGroceryLen = 1;
      userGrocery.push(userGrocery2);
    }
    }


  
  
    });


    //==================== USER Daily Tasks ============================
    let userDailyTasks = [];
    let userDailyTasksLen = 0;
    // /.catch(e =>   .log(e));

    //==================== USER Weekly Tasks ============================

    let userWeeklyTasks = [];
    let userWeeklyTasksLen = 0;

    
    await tasksDB.findOne({ ChatID: req.user.ChatID }, async(err, data) => {
      if(err) throw err;
  
    if(data.dailyTasks && data.dailyTasks.length > 0) {
    if(data.dailyTasks.length > 1) {
    userDailyTasksLen = await data.dailyTasks.length;
    for(i=0; i<4; i++) {
      if(data.dailyTasks[i] === undefined || data.dailyTasks[i] === null) return;
      userDailyTasks.push(data.dailyTasks[i]);
    }
    } else if(data.dailyTasks.length === 1){
      const userDailyTasks2 = await data.dailyTasks[0]
      userDailyTasksLen = 1;
      userDailyTasks.push(userDailyTasks2);
    }
    }

    if(data.weeklyTasks && data.weeklyTasks.length > 0) {
      if(data.weeklyTasks.length > 1) {
      userWeeklyTasksLen = await data.weeklyTasks.length;
      for(i=0; i<4; i++) {
        if(data.weeklyTasks[i] === undefined || data.weeklyTasks[i] === null) return;
        userWeeklyTasks.push(data.weeklyTasks[i]);
      }
      } else if(data.weeklyTasks.length === 1){
        const userWeeklyTasks2 = await data.weeklyTasks[0]
        userWeeklyTasksLen = 1;
        userWeeklyTasks.push(userWeeklyTasks2);
      }
      }


  
  
    });


/*
    //==================== USER Weekly Tasks ============================
    let userWeeklyTasks = [];
    let userWeeklyTasksLen = 0;
    // /.catch(e =>   .log(e));
    await tasksDB.findOne({ ChatID: req.user.ChatID }, async(err, data) => {
      if(err) throw err;
  
    if(data.weeklyTasks && data.weeklyTasks.length > 0) {
    if(data.weeklyTasks.length > 1) {
    userWeeklyTasksLen = await data.weeklyTasks.length;
    for(i=0; i<4; i++) {
      if(data.weeklyTasks[i] === undefined || data.weeklyTasks[i] === null) return;
      userWeeklyTasks.push(data.weeklyTasks[i]);
    }
    } else if(data.weeklyTasks.length === 1){
      const userWeeklyTasks2 = await data.weeklyTasks[0]
      userWeeklyTasksLen = 1;
      userWeeklyTasks.push(userWeeklyTasks2);
    }
    }

    });

*/

  res.render('dashboard', {
    user: req.user,
    allNotes: userNotes,
    allNotesLen: userNotesLen,
    allGrocery: userGrocery,
    allGroceryLen: userGroceryLen,
    allDailyTasks: userDailyTasks,
    allDailyTasksLen: userDailyTasksLen,
    allWeeklyTasks: userWeeklyTasks,
    allWeeklyTasksLen: userWeeklyTasksLen
  })




});

module.exports = router;
