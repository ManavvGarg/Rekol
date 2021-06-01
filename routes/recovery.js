const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { sendMailAfterReset, sendMailRecovery } = require("../config/email")

//Random UUID
const { v4: uuidv4 } = require('uuid');

//Models
const userDB = require("../models/User");
const recoveryDB = require("../models/password");

router.get('/', async (req, res, next) => {

  res.render(`password-recovery`);

});

router.post('/', async (req, res, next) => {
    const { email } = req.body;
    let errors = [];
    
    if (!email) {
      errors.push({ msg: 'Please enter all fields' });
    }
    
    if (errors.length > 0) {
    
      res.render('password-recovery', {
        email
      });
    
    } else {
      
      const user = await userDB.findOne({ email: email });
        if (user) {
                user.recoveryBoolean = true;
                let uuidCode = await uuidv4();
                const newData = new recoveryDB({
                  name: user.name,
                  email: user.email,
                  rID: uuidCode
                })
                user.save();
                newData.save();

                await sendMailRecovery(email, uuidCode);
                req.flash(
                  'success_msg',
                  'Email verified! Please check your email for password recovery link!'
                );
                res.redirect('/recovery');
    
        } else {
    
          errors.push({ msg: 'This email does not exists!' });
          res.redirect('/recovery', {
            email
          })
    
        }
    }
  });



router.get('/:id', async(req, res) => {
    const uuid = req.params.id;
    const user = await recoveryDB.findOne({ rID: uuid }).catch(e => console.log(e));
    const userRecovery = await userDB.findOne({ email: user.email, recoveryBoolean: true }).catch(e => console.log(e));

if(user) {
  if(userRecovery.recoveryBoolean === true) {
    res.render('password-reset', {uuid:uuid})
  } 

  else {
    console.log(`${uuid} - not working`)
      res.redirect('/users/login')
  }
}

else {
  res.redirect('/welcome')
}



});


router.post('/:uuid', async(req, res) => {
  let errors = [];
  const uuid = req.params.uuid;
  const { password, password2 } = req.body;

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match!' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('password-reset', {
      password,
      password2,
    });
  }

  else {
    const user = await recoveryDB.findOne({ rID: uuid }).catch(e => console.log(e));
    const userRecovery = await userDB.findOne({ email: user.email }).catch(e => console.log(e));
  
  if(user) {
  if(userRecovery) {
    
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        userRecovery.password = hash;
        userRecovery.recoveryBoolean = false;
        recoveryDB.findOneAndDelete({ rID: uuid, email: user.email });
        userRecovery
          .save()
          .then(async user => {

            req.flash(
              'success_msg',
              'Password has been reset! Please login to continue!'
            );

            res.redirect('/users/login');
            await sendMailAfterReset(userRecovery.email);
  
  
          })
          .catch(err => console.log(err));
      });
    });
  
  } 
  
  else {
      res.redirect('/users/login')
  }
  }
  
  else {
  res.redirect('/welcome')
  }
  }



});

module.exports = router;
