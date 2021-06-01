const express = require('express');
const router = express.Router();

//Models
const notesDB = require("./../models/notes");
const groceryDB = require("./../models/grocery");
const tasksDB = require("./../models/tasks");

//MakeID function
const { makeid } = require("../modules/functions")

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { init } = require('./../models/notes');

//================================================================================
// New note Render Page
//================================================================================

router.get('/notes/new', ensureAuthenticated, async (req, res) => {
    res.render('new-note', {
        user: req.user
    })
});


//================================================================================
// New note ACTUAL BACKEND [POST METHOD]
//================================================================================

router.post('/notes/new', ensureAuthenticated, async (req, res) => {

    const { name, note } = req.body;
    var newNoteID = `${await makeid(4)}`;
    let errors = [];
  
    if (!name || !note) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (errors.length > 0) {
      res.render('new-note', {
        errors,
        name,
        note
      });
    } else {
    
            const userNotes = await notesDB.findOne({ChatID: req.user.ChatID});

            //console.log(`working...3`)
        
            if(!userNotes || userNotes === null || userNotes === undefined) {
                return chat.sendMessage(`Your Account was not found! \nPlease start making the account by first telling us your name!\n\nPlease register/make an account on our website to get started!\nhttps://rekol.herokuapp.com/users/register/`)
            }
            const storedNotes = userNotes.notes;
            
           // console.log(`working...4`)
        
        
            //Loop to check if the notes have the ID that was made by the above funtion. if they do make a new id until its no longer in the DB.
            var notecheck = [];
            while(notecheck.length === 0) {
                for(i in storedNotes) {
                    let element = storedNotes[i];
                    if(element.id === newNoteID) {
                        newNoteID = `${await makeid(4)}`;
                        notecheck.push(`${newNoteID}`)
                    }
                    break;
                }  break;
            }
              
    //console.log(`working...6`)

    await notesDB.findOneAndUpdate({ChatID: req.user.ChatID},
        {$addToSet: {notes: {id: newNoteID, name: name, note: note.trim(), timestamp: Date.now()}}}
        ).catch(e => {
            console.log(e);
        }).then(async() => {          
            await req.flash('success_msg', 'Successfully saved your note!'); await res.redirect('/dashboard/notes'); });

        
      }

});


//================================================================================
// Delete Note ACTUAL BACKEND [POST METHOD]
//================================================================================

router.get('/notes/delete/:id', ensureAuthenticated, async (req, res) => {

    const noteID = req.params.id;
                const userNotes = await notesDB.findOne({ChatID: req.user.ChatID});
        
            if(!userNotes || userNotes === null || userNotes === undefined) {
                return chat.sendMessage(`Your Account was not found! \nPlease start making the account by first telling us your name!\n\nPlease register/make an account on our website to get started!\nhttps://rekol.herokuapp.com/users/register/`)
            }
            const storedNotes = userNotes.notes;

    await notesDB.findOneAndUpdate({ChatID: req.user.ChatID},
        {$pull: {notes: {id: noteID}}}
        ).catch(e => {
            console.log(e);
        }).then(async() => {          
            await req.flash('success_msg', 'Successfully deleted your note!'); await res.redirect('/dashboard/'); });


});

//================================================================================
// Grocery Items ADDITION BACKEND [POST METHOD]
//================================================================================

router.post('/grocery/new', ensureAuthenticated, async (req, res) => {

    const { item } = req.body;
    let errors = [];
  
    if (!item) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (errors.length > 0) {
      res.render('/dashboard', {
        errors,
        item
      });
    } else {
    
            const userGrocery = await groceryDB.findOne({ChatID: req.user.ChatID});            
            if(!userGrocery || userGrocery === null || userGrocery === undefined) {
                return chat.sendMessage(`Your Account was not found! \nPlease start making the account by first telling us your name!\n\nPlease register/make an account on our website to get started!\nhttps://rekol.herokuapp.com/users/register/`)
            }

            if(item.includes(",")) {
                let itemsFinal = item.split(",");

                itemsFinal.forEach(async element => {
                    await groceryDB.findOneAndUpdate({ChatID: req.user.ChatID},
                        {$addToSet: {Grocery: `${element.trim()}`}}
                        ).catch(e => {
                            console.log(e);
                        })

                });

                await req.flash('success_msg', 'Successfully added items to  Grocery List!'); 
                await res.redirect('/dashboard');

            }

            else {

                    await groceryDB.findOneAndUpdate({ChatID: req.user.ChatID},
                        {$addToSet: {Grocery: `${item.trim()}`}}
                        ).catch(e => {
                            console.log(e);
                        })

                await req.flash('success_msg', 'Successfully added items to  Grocery List!'); 
                await res.redirect('/dashboard');
            }
      }

});

//================================================================================
// Daily Tasks ADDITION BACKEND [POST METHOD]
//================================================================================

router.post('/tasks/daily/new', ensureAuthenticated, async (req, res) => {

    const { taskName } = req.body;
    let errors = [];
  
    if (!taskName) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (errors.length > 0) {
      res.render('dashboard', {
        errors,
        taskName
      });
    } else {
    
            const userTasks = await tasksDB.findOne({ChatID: req.user.ChatID});
            if(!userTasks || userTasks === null || userTasks === undefined) {
                return chat.sendMessage(`Your Account was not found! \nPlease start making the account by first telling us your name!\n\nPlease register/make an account on our website to get started!\nhttps://rekol.herokuapp.com/users/register/`)
            }

            if(taskName.includes(",")) {
                let tasksFinal = taskName.split(",");

                tasksFinal.forEach(async element => {
                    await tasksDB.findOneAndUpdate({ChatID: req.user.ChatID},
                        {$addToSet: {dailyTasks: `${element.trim()}`}}
                        ).catch(e => {
                            console.log(e);
                        })

                });

                await req.flash('success_msg', 'Successfully added tasks to Daily Tasks List!'); 
                await res.redirect('/dashboard');

            }

            else {

                    await tasksDB.findOneAndUpdate({ChatID: req.user.ChatID},
                        {$addToSet: {dailyTasks: `${taskName.trim()}`}}
                        ).catch(e => {
                            console.log(e);
                        })

                req.flash('success_msg', 'Successfully added tasks to Daily tasks list!'); 
                await res.redirect('/dashboard');
            }
      }

});


//================================================================================
// Weekly Tasks ADDITION BACKEND [POST METHOD]
//================================================================================

router.post('/tasks/weekly/new', ensureAuthenticated, async (req, res) => {

    const { taskName } = req.body;
    let errors = [];
  
    if (!taskName) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (errors.length > 0) {
      res.render('dashboard', {
        errors,
        taskName
      });
    } else {
    
            const userTasks = await tasksDB.findOne({ChatID: req.user.ChatID});
            if(!userTasks || userTasks === null || userTasks === undefined) {
                return chat.sendMessage(`Your Account was not found! \nPlease start making the account by first telling us your name!\n\nPlease register/make an account on our website to get started!\nhttps://rekol.herokuapp.com/users/register/`)
            }

            if(taskName.includes(",")) {
                let tasksFinal = taskName.split(",");

                tasksFinal.forEach(async element => {
                    await tasksDB.findOneAndUpdate({ChatID: req.user.ChatID},
                        {$addToSet: {weeklyTasks: `${element.trim()}`}}
                        ).catch(e => {
                            console.log(e);
                        })

                });

                await req.flash('success_msg', 'Successfully added tasks to Weekly Tasks List!'); 
                await res.redirect('/dashboard');

            }

            else {

                    await tasksDB.findOneAndUpdate({ChatID: req.user.ChatID},
                        {$addToSet: {weeklyTasks: `${taskName.trim()}`}}
                        ).catch(e => {
                            console.log(e);
                        })

                req.flash('success_msg', 'Successfully added tasks to Weekly tasks list!'); 
                await res.redirect('/dashboard');
            }
      }

});


//================================================================================
// Display Notes Page
//================================================================================

router.get('/notes', ensureAuthenticated, async (req, res) => {
    const userNotes = await notesDB.findOne({ ChatID: req.user.ChatID }).catch(e => console.log(e));
    if(!userNotes) {
        res.render('dashboard', {
            user: req.user,
            allNotes: userNotes
        })
    }
    res.render('notes', {
        user: req.user,
        allNotes: userNotes
    })
});


//================================================================================
// Display Grocery Page
//================================================================================

router.get('/grocery', ensureAuthenticated, async (req, res) => {
    const userGrocery = await groceryDB.findOne({ ChatID: req.user.ChatID }).catch(e => console.log(e));
    if(!userGrocery) {
        res.render('dashboard', {
            user: req.user,
            allGrocery: userGrocery.Grocery
        })
    }
    res.render('grocery-page', {
        user: req.user,
        allGrocery: userGrocery.Grocery
    })
});


//================================================================================
// Display Daily Tasks Page
//================================================================================

router.get('/tasks/daily', ensureAuthenticated, async (req, res) => {
    const userTasks = await tasksDB.findOne({ ChatID: req.user.ChatID }).catch(e => console.log(e));
    if(!userTasks) {
        res.render('dashboard', {
            user: req.user,
            allTasks: userTasks.dailyTasks
        })
    }
    res.render('dailyTask-page', {
        user: req.user,
        allTasks: userTasks.dailyTasks
    })
});


//================================================================================
// Display Weekly Tasks Page
//================================================================================

router.get('/tasks/weekly', ensureAuthenticated, async (req, res) => {
    const userTasks = await tasksDB.findOne({ ChatID: req.user.ChatID }).catch(e => console.log(e));
    if(!userTasks) {
        res.render('dashboard', {
            user: req.user,
            allTasks: userTasks.weeklyTasks
        })
    }
    res.render('weeklyTask-page', {
        user: req.user,
        allTasks: userTasks.weeklyTasks
    })
});


//================================================================================
// Display A specific Note
//================================================================================

router.get('/notes/:id', ensureAuthenticated, async(req, res) => { 
    const noteId = req.params.id;
    const userNotes = await notesDB.findOne({ ChatID: req.user.ChatID }).catch(e => console.log(e));
    if(userNotes) {
        for(i in userNotes.notes) {
            let element = userNotes.notes[i];
            if(element.id === noteId) {
                res.render('note-page', {
                    user: req.user,
                    note: userNotes.notes[i].note,
                    noteName: userNotes.notes[i].name,
                    noteID: noteId
                })
            }
        }
    }

    else {
        res.render('note-page', {
            user: req.user,
            note: null,
            noteName: null,
            noteID: null
        })
    }



});









module.exports = router;
