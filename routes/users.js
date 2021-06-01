const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Random UUID
const { v4: uuidv4 } = require('uuid');

//save function
const { save } = require('../storage/functions')

//Email
const { sendMail, sendMailRecovery } = require("../config/email")

// Load User model
const User = require('../models/User');
const UserNotes = require('../models/notes');
const UserTasks = require('../models/tasks');
const UserGrocery = require('../models/grocery')

const firstMessage = require('../models/confirmation');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2, Contact, country, countryCode, timezone } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2 || !Contact || !countryCode || !timezone) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
      Contact,
      country,
      timezone
    });
  } else {
    
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'That Email and Number already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2,
          country,
          timezone
        });
      } else { // =============
        const phoneNumberWS = `${countryCode}${Contact}@c.us`;
        User.findOne({ChatID : phoneNumberWS}).then(async user => {
          if(user) {
            errors.push({ msg: 'That Number already exists!' });
            res.render('register', {
              errors,
              name,
              email,
              password,
              password2,
              country,
              timezone
            });
          }

          else {


        const newUser = new User({
          name,
          email,
          password,
          Contact,
          country,
          countryCode,
          timezone
        });
        const newUserNotes = new UserNotes({
          name,
          email,
        });

        const newUserTasks = new UserTasks({
          name,
          email
        });

        const newUserGrocery = new UserGrocery({
          name,
          email
        });

        //User
        let uuidCode = await uuidv4();
        newUser.Contact = `${countryCode}${Contact}`;
        newUser.ChatID = `${countryCode}${Contact}@c.us`;
        newUser.emailVerification = uuidCode;
        newUser.emailVerificationBoolean = false;

        //Notes
        newUserNotes.ChatID = `${countryCode}${Contact}@c.us`;
        
        //Tasks
        newUserTasks.ChatID = `${countryCode}${Contact}@c.us`;
        
        //Grocery
        newUserGrocery.ChatID = `${countryCode}${Contact}@c.us`;
        

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(async user => {

                req.flash(
                  'success_msg',
                  'You are now registered!\nPlease check your email for verification!'
                );
                const response = {
                  name: newUser.name,
                  contact : `${newUser.Contact}@c.us`,
                  email: `${newUser.email}`
                }
                
                res.redirect('/users/login');
                const newUserMessage = await new firstMessage({
                  Name: response.name,
                  Contact: response.contact,
                  Email: response.email,
                  firstMessageOnReg: false
                });
                await newUserMessage.save().catch(e => console.log(e));
                await save(response);

                await newUserNotes.save().catch(e => console.log(e));
                await newUserTasks.save().catch(e => console.log(e));
                await newUserGrocery.save().catch(e => console.log(e));
                await sendMail(email, uuidCode);


              })
              .catch(err => console.log(err));
          });
        });


          }
        });
      } //=======================
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
