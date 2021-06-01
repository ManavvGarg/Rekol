
const notesDB = require("../models/notes")
const { regFirstWords, makeid } = require("../assets/functions")

//================================================================================
// make notes
//================================================================================

async function make(message) {  
    const chat = (await message.getChat());      
    const db = await notesDB.findOne({ChatID: chat.id._serialized});
    if(!db || db === null || db === undefined) {
        return chat.sendMessage(`Your Account was not found! \nPlease start making the account by first telling us your name!\n\nPlease register/make an account on our website to get started!\nhttps://rekol.herokuapp.com/users/register`)
    }

    //console.log(`working...`)
    const noteNameDraft = await regFirstWords(message.body.toLowerCase(), 3);
    const noteName = await noteNameDraft.replace("new note ", "").trim();
    const note = message.body.toLowerCase().replace(`${noteNameDraft}`, "").trim();
    if(!note) return chat.sendMessage(`You cannot make an empty note! Please try to type-in things you actually want to note!`);
    if(note.trim().length > 2048) return chat.sendMessage(`You cannot make a note with more than 2048 Characters!\nNotes are for small important things!`);

    //console.log(`working...2`)

    var noteID = `${await makeid(4)}`;

    const userNotes = await notesDB.findOne({ChatID: chat.id._serialized});

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
            if(element.id === noteID) {
                noteID = `${await makeid(4)}`;
                notecheck.push(`${noteID}`)
            }
            break;
        }  break;
    }
    

    //console.log(`working...6`)

    await notesDB.findOneAndUpdate({ChatID: chat.id._serialized},
        {$push: {notes: {id: noteID, name: noteName, note: note.trim(), timestamp: Date.now()}}}
        ).catch(e => {
            console.log(e);
            chat.sendMessage(`An error occured while saving that note!\nSorry For the invconvinience caused! Please try again later..`)
        }).then(async() => { chat.sendMessage(`Okay! Saved your note successfully! \n\nYour note name: *${noteName}*\nYour note ID: ${noteID}`) });
    
}


//================================================================================
// Show Notes
//================================================================================

async function show(message) {
    const chat = (await message.getChat());
    await notesDB.findOne({ChatID: chat.id._serialized}, async(err, data) =>{
        if(err) throw err;
        if(data) {
            const allNotes = data.notes;
            if(allNotes === null || allNotes === undefined || allNotes === []) return chat.sendMessage(`No notes are available! Please try and write some up!`);
            let msg = `Here are all the notes with names and their IDs!`
            for(i in allNotes) {
                let element = allNotes[i];
                msg+= `\n\nName: *${element.name}* | ID: *${element.id}*`
            }
            await chat.sendMessage(msg);

        }

        else if(!data) {
             return chat.sendMessage(`Hey I am _*Rekol*_! I can help you with your daily tasks, weekly tasks, as well as remind you anything you want me to!\n\nFirstly! I would like to know your name! So that I can easily _rekol_ who you are! \n_(See what I did there? haha)_\n\nPlease register/make an account on our website to get started!\nhttps://rekol.herokuapp.com/users/register/`);
        }
    })
    
}

//================================================================================
// View a specific note
//================================================================================

async function view(message) {
    const chat = (await message.getChat());        
    const db = await notesDB.findOne({ChatID: chat.id._serialized});
    if(!db || db === null || db === undefined) {
        return chat.sendMessage(`Your Account was not found! \nPlease start making the account by first telling us your name!\n\nPlease register/make an account on our website to get started!\nhttps://rekol.herokuapp.com/users/register`)
    }

    //console.log(`working....`)
    const noteID = message.body.toLowerCase().replace("view note ", "").replace(/^\s*|\s*$/g, '');
    if(!noteID) return chat.sendMessage(`You must provide me a note ID! You can look for all your notes with, *view notes*`)
    await notesDB.findOne({ChatID: chat.id._serialized}, async(err, data) =>{
        if(err) throw err;
        if(data) {
            //console.log(`working ....2`)
            const allNotes = data.notes;
            for(i in allNotes) {
               // console.log(`working....3`)
                let element = allNotes[i];
               // console.log(`working....4`)
               // console.log(`ELEMENT ID: ${element.id} | NOTE ID: ${noteID}`)
                if(element.id.toLowerCase() === noteID) { return chat.sendMessage(`Note name: *${element.name}* | ID: *${element.id}*\n\n${element.note}`) };  
                
            }

        }
    });
}

//================================================================================
// Remove a specific note
//================================================================================

async function remove(message) {
    const chat = (await message.getChat());        
    const db = await notesDB.findOne({ChatID: chat.id._serialized});
    if(!db || db === null || db === undefined) {
        return chat.sendMessage(`Your Account was not found! \nPlease start making the account by first telling us your name!\n\nPlease register/make an account on our website to get started!\nhttps://rekol.herokuapp.com/users/register`)
    }

    const noteIDs = [`${message.body.toLowerCase().replace("delete note ", "")}`];
    var noteID;
    if(noteIDs[0].includes(",")) { noteID = noteIDs[0].split(",");}
    else { noteID = [`${noteIDs[0].trim()}`]}

    //console.log(`working....`)
    if(!noteID) return chat.sendMessage(`You must provide me a note ID! You can look for all your notes with, *view notes*`)


    await notesDB.findOne({ChatID: chat.id._serialized}, async(err, data) =>{
        if(err) throw err;
        if(data) {

            const allNotes = data.notes;
            for(i in allNotes) {
                let element = allNotes[i];
                for(a in noteID) {
                    if(element.id.toLowerCase() === a) {
                        await notesDB.findOneAndUpdate({ChatID : chat.id._serialized}, {$pull: {notes: element}}).catch(err => console.log(err));
                        return chat.sendMessage(`Okay done! I have removed a note with name _*${element.name}*_ from your notes!\n\nTo view all notes, send me a message as follows!\n\n_*show all notes*_`)
                    }
                }
                
            }

        }
    });
}

module.exports = { make, show, view, remove }