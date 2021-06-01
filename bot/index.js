//Defining essential constants
const { Client } = require("whatsapp-web.js");
const tCode = require("qrcode-terminal")
const figlet = require("figlet");
const fs = require("fs");
const { greeting } = require("./assets/words");
const { regFirstWords } = require("./assets/functions");

//Base URL
const { mainURL } = require('../config/keys')

//Requiring bot information and creator information
const { mongoURI } = require("./config")

//Requiring mongoose for database creation/storage of information
const mongoose = require("mongoose");

//Models
const messageDB = require("./models/confirmation");
const userDB = require("./models/user");

//Modules
const helpC = require("./modules/help");
const notesC = require("./modules/notes");
const listRemove = require("./modules/removeElement");
const listView = require("./modules/viewElement");
const listAdd = require("./modules/addElement");
const owner = require("./modules/owner");
const remind = require("./modules/reminder");

//Authenticating with mongoose
try {
    mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected - Bot'))
  .catch(err => console.log(err));
mongoose.set('useFindAndModify', false);
    } catch(e) { console.log(e) }

//Requiring session config.
const sessionSave = __dirname + '/sessions/session.json';

let sessionData;
if(fs.existsSync(sessionSave)) { sessionData = require(sessionSave); };

//Defining bot
const bot = new Client({
    session: sessionData,
    puppeteer: {headless: true,
        args: ['--no-sandbox','--disable-setuid-sandbox']}
});

//QR Code gen event
bot.on("qr", qr =>{
    tCode.generate(qr, {small : true});
})


//Authenticated Event
bot.on("authenticated", auth => {
    sessionData = auth;
    fs.writeFile(sessionSave, JSON.stringify(auth), function(err) { if(err) console.log(err) })
})

// Initializing the bot
bot.initialize();

//Ready Event
bot.on("ready", async()=>{
    //Chnage the bot ready to anything you want :D
    figlet.text(`Rekol ready!`, function (err, data) {
        if (err) {
            console.log('Something went wrong');
            console.dir(err);
        }
        console.log(`═════════════════════════════════════════════════════════════════════════════`);
        console.log(data)
        console.log(`═════════════════════════════════════════════════════════════════════════════`);
      });


    //Sending a message on registeration. To check for new regs, make an interval of 2 seconds.
    setInterval(async() => {
    // Read collection.json file
    fs.readFile("storage/collection.json", async function(err, data) {

    // Check for errors
    if (err) throw err;

    //Check for data
    if(!data) return console.log(`No data available in collection.json`);
   
    // Converting to JSON
    const users = JSON.parse(data);

    for(i in users) {
        //get contact
        const contact = users[i].contact;
        
        //get email
        const email = users[i].email;
        
        //get user from mongo
        const user = await messageDB.findOne({ Email: email });
        
        //if no user, then return
        if(!user) return;
        
        //check for false [first message on reg]
        if(user.firstMessageOnReg === false) {
            bot.sendMessage(contact, `Hi _*${users[i].name}*_ ! I am glad to meet you finally! It was a long registering process isnt it?\nBut we have to do so in order to serve you with my maximum potential!\n\nNow you can text me "help" for further help!\n\nHave a nice day ahead!`).catch(e => {
                return console.log(e);
            });
            await messageDB.findOneAndUpdate(
                { Email: email },
                {$set : {firstMessageOnReg : true}}
            ).then(console.log(`Data Saved, Message Sent! Done!`)).catch(e => { return console.log(e) })
            
        }
    }
      
});
    }, 1000)

})


//Disconnected || Auth deactivate
bot.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});


//============================================================= Message Event ================================================================
bot.on("message", async(message) => {
    const chat = (await message.getChat());
    const verification = await userDB.findOne({ ChatID: chat.id._serialized });
    if(!verification || verification === null || verification === undefined) {
        return chat.sendMessage(`Hey I am _*Rekol*_! I can help you with your daily tasks, weekly tasks, as well as make you a grocery list!\n\nFirstly! I would like to know your name! So that I can easily _rekol_ who you are! \n_(See what I did there? haha)_\n\nPlease register/make an account on our website to get started!\n${mainURL}`);
    }
    if(verification.emailVerificationBoolean === false) return chat.sendMessage(`Hey! You need to verify your email first in order to have me as your assistant!`);

    //Default automated message upon hi.
    if(greeting.includes(message.body.toLowerCase())) { return bot.sendMessage(message.from, `Hello! I am _*Rekol*_ ! Get started by typing "help".`)};
        
    //================================================================================
    // Help menu
    //================================================================================
    
    //Help automated response.
    if(message.body.toLowerCase() === "help") {
        await helpC.send(message);

    }

    if(message.body.toLowerCase().startsWith("help ")) {
        await helpC.send2(message);
    
    };

    //================================================================================
    // Add itmes to list
    //================================================================================


   if(message.body.toLowerCase().startsWith("add ")) {
    await listAdd.add(message);
   }



    //================================================================================
    // View Lists
    //================================================================================


   if(message.body.toLowerCase().startsWith("view ")) {
       const noteCheck = await regFirstWords(message.body.toLowerCase(), 3);
       if(!noteCheck.match("view note")) await listView.view(message);
       await notesC.view(message);
       
   }
   


    //================================================================================
    // Delete items from Lists
    //================================================================================

    if(message.body.toLowerCase().startsWith("remove")) {
    
        await listRemove.remove(message);
    
       }




    //================================================================================
    // Reminder Module
    //================================================================================

    if(message.body.toLowerCase().startsWith("remind me at")) {
        await remind.at(message);
    }   

    if(message.body.toLowerCase().startsWith("remind me after")) {
        await remind.after(message);
    }


    //================================================================================
    // Notes Module
    //================================================================================

    if(message.body.toLowerCase().startsWith('new note ')) {
        
        await notesC.make(message);  //New Note

    }

    if(message.body.toLowerCase().startsWith(`show all notes`)) {
        
        await notesC.show(message); //Show all notes
        
    }

   if(message.body.startsWith("delete note ")) {

        await notesC.remove(message); //Delete Note
    
    }

    //view note is in "view lists" section actually, to prevent bugs -_-
    
    

    //================================================================================
    // Owner only commands
    //================================================================================

    if (message.body.startsWith('!status ')) {
        await owner.status(message);
    }

});



