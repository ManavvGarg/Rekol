const express = require('express');
const router = express.Router();

//Models
const userDB = require("../models/User");

router.get('/:uuid', async(req, res) => {
    const uuid = req.params.uuid;
    const user = await userDB.findOne({ emailVerification: uuid }).catch(e => console.log(e));
    if(user) {
        const userEmail = user.email;
        const userName = user.name;
        user.emailVerificationBoolean = true;
        user.emailVerification = "null";
        await user.save();
        res.set({'Refresh': '6; url=/users/login'});
        res.render('email-verify', {
            email: userEmail,
            name: userName
        })
    }

    else {
        res.json(`User not found`)
    }



});

module.exports = router;
