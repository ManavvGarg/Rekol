const nodemailer = require("nodemailer");
const { mainURL } = require("./keys")

async function sendMail(email, uuid) {
    var Transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "example@gmail.com",  //Your GMAIL ID here
            pass: "password" //Your GMAIL Account Password here
        }
    });


    //Change The following tet according to your need

    var mailOptions;
    let sender = `Rekol App © 2021 | Manav Garg`
    mailOptions = {
        from: sender,
        to: email,
        subject: "Email Verification - Rekol App",
        html: `Hey!<br>Welcome to our app! We are highly obliged to have you as our client and we wish to serve you well in the coming future ahead!<br>Click on the button below for verification of your account!<br><br><a href='${mainURL}/verify/${uuid}' style='background-color: #25D366; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; -webkit-transition-duration: 0.4s; transition-duration: 0.4s; box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19);'>Verify your email ❯</a><br><br>Thanks and have a great day/night ahead!<br>Manav Garg<br>CEO & Founder<br>Rekol Inc. © 2021`
    };

    Transport.sendMail(mailOptions, function(error, response) {
        if(error) {
            console.log(`Failed To send email to: ${email}\nERROR: ${error}`);
        }

        else {
            console.log(`Successfully sent email to: ${email}`)
        }
    });
}

async function sendMailRecovery(email, uuid) {
    var Transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "example@gmail.com",  //Your GMAIL ID here
            pass: "password" //Your GMAIL Account Password here
        }
    });

    
    //Change The following tet according to your need

    var mailOptions;
    let sender = `Rekol App © 2021 | Manav Garg`
    mailOptions = {
        from: sender,
        to: email,
        subject: "Password Recovery - Rekol App",
        html: `Hey!<br>I see you have forgotten your password, No worries! Here's your password reset link below!<br>Click on the button below for password recovery of your account!<br><br><a href='${mainURL}/recovery/${uuid}' style='background-color: #25D366; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;'>Reset your password ❯</a><br><br>Thanks and have a great day/night ahead!<br><br>Rekol Inc. © 2021`
    };

    Transport.sendMail(mailOptions, function(error, response) {
        if(error) {
            console.log(`Failed To send email to: ${email}\nERROR: ${error}`);
        }

        else {
            console.log(`Successfully sent password recovery email to: ${email}`)
        }
    });
}

async function sendMailAfterReset(email) {
    var Transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "example@gmail.com",  //Your GMAIL ID here
            pass: "password" //Your GMAIL Account Password here
        }
    });

    
    //Change The following tet according to your need

    var mailOptions;
    let sender = `Rekol App © 2021 | Manav Garg`
    mailOptions = {
        from: sender,
        to: email,
        subject: "Password Recovery - Rekol App",
        html: `Hey!<br>Your account password has been changed! If you did not initiate this, please contact support immediately!<br><br>Thanks and have a great day/night ahead!<br><br>Rekol Inc. © 2021`
    };

    Transport.sendMail(mailOptions, function(error, response) {
        if(error) {
            console.log(`Failed To send email to: ${email}\nERROR: ${error}`);
        }

        else {
            console.log(`Successfully sent password recovery email to: ${email}`)
        }
    });
}

module.exports = { sendMail, sendMailRecovery, sendMailAfterReset };