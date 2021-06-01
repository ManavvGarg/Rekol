
const userDB = require("./../models/user"); //User Model

const { daily, greeting, week, noteWords, grocery, remind } = require("../assets/words");

async function send(message) {
    const chat = (await message.getChat());
    //return console.log(contact)
    const user = await userDB.findOne({ChatID : `${chat.id._serialized}`});
    if(!user) {
        return chat.sendMessage(`Hey I am _*Rekol*_! I can help you with your daily tasks, weekly tasks, as well as remind you anything you want me to!\n\nFirstly! I would like to know your name! So that I can easily _rekol_ who you are! \n_(See what I did there? haha)_\n\nPlease register/make an account on our website to get started!\nhttps://rekol.herokuapp.com/users/register/
    `);
    }
    if(!user.name) {
        return chat.sendMessage(`Hey I am _*Rekol*_! I can help you with your daily tasks, weekly tasks, as well as remind you anything you want me to!\n\nFirstly! I would like to know your name! So that I can easily _rekol_ who you are! \n_(See what I did there? haha)_\n\nPlease register/make an account on our website to get started!\nhttps://rekol.herokuapp.com/users/register/
    `);
    }

    return chat.sendMessage(`Hey _*${user.name}*_! \nYou need help? Okay! Here are all the things below I can do!\n\n_*1 •*_ Remind you about stuff! \n[ask me _*help reminder*_]\n\n_*2 •*_ Note/Store your daily tasks! \n[ask me _*help daily tasks*_]\n\n_*3 •*_ Note/Store your weekly tasks! \n[ask me _*help weekly tasks*_]\n\n_*4 •*_ Make up your grocery list! \n[ask me _*help grocery*_]\n\n_*5 •*_ Save/Store short notes! \n[ask me _*help notes*_]`);
}

async function send2(message) {
    const chat = (await message.getChat());    
    const db = await userDB.findOne({ChatID: chat.id._serialized});
    if(!db || db === null || db === undefined) {
        return chat.sendMessage(`Your Account was not found! \nPlease start making the account by first telling us your name!\n\nPlease register/make an account on our website to get started!\nhttps://rekol.herokuapp.com/users/register/`)
    }
    const menuOption = message.body.toLowerCase().split("help ")[1];
    if(remind.includes(menuOption.toLowerCase())) {
        //await chat.sendMessage(`Hey there! I see you need help with the _*Remind*_ Module I have.\nIt's very simple and easy to use!\nHere let me show you haha-\n\n _• To set a reminder_,\nsimply send me a message following the below format! : \n\nremind me at _*time here*_ for _*the thing you want me to remind you about here*_\n\n _• To view Reminders_,\nsimply send me a message following the below format!\n\nview reminders`)
        await chat.sendMessage(`Sorry for the inconvinience caused! \n\nBut my reminder module is not yet completed! \nThough make sure to check again after few weeks!`)
    }

    else if(grocery.includes(menuOption.toLowerCase())) {
        await chat.sendMessage(`Hey there! I see you need help with the _*Grocery*_ Module I have.\nIt's very simple and easy to use!\nHere let me show you haha-\n\n _• To add items in a list, simply text me:_ \n\nadd _*item name here*_ to grocery list\n*Example:* add ketchup to grocery list\n\n _• To add multiple items in the list, simply text me:_ \n\nadd _*item names here separated by a comma*_ to grocery list\n*Example:* add ketchup, cookies, chips to grocery list\n\n _• To view the grocery list_,\nsimply text me: \n\nview grocery list\n\n _• To remove items from the list, simply text me:_ \n\nremove _*item name here*_ from grocery list\n*Example:* remove ketchup from grocery list\n\n _• To remove multiple items from the list, simply text me:_ \n\nremove _*item names here separated by a comma*_ from grocery list\n*Example:* add ketchup, cookies, chips from grocery list`);
    }

    else if(daily.includes(menuOption.toLowerCase())) {
            await chat.sendMessage(`Hey there! I see you need help with the _*Daily Tasks*_ Module I have.\nIt's very simple and easy to use!\nHere let me show you haha-\n\n _• To add a task_, \nsimply text me : \n\nadd _*task name here*_ to daily tasks\n\n _• To add multiple tasks in the list, simply text me:_ \n\nadd _*tasks here separated by a comma*_ to daily tasks\n*Example:* add coding to daily tasks\n\n _• To view all task for today_, \nsimply text me : \n\nview daily tasks\n*Example:* add study, workout, coding to daily tasks\n\n _• To remove tasks from the list, simply text me:_ \n\nremove _*task name here*_ from daily tasks\n*Example:* remove coding from daily tasks\n\n _• To remove multiple tasks from the list, simply text me:_ \n\nremove _*task names here separated by a comma*_ from daily tasks\n*Example:* remove study, workout, coding from daily tasks\n\n_*NOTE:-*_\nDaily tasks reset everyday at 12AM your time!`)
    }

    else if(week.includes(menuOption.toLowerCase())) {
        await chat.sendMessage(`Hey there! I see you need help with the _*Weekly Tasks*_ Module I have.\nIt's very simple and easy to use!\nHere let me show you haha-\n\n _• To add a task_, \nsimply text me : \n\nadd _*task name here*_ to weekly tasks\n*Example:* add buy books to weekly tasks\n\n _• To add multiple tasks in the list, simply text me:_ \n\nadd _*tasks here separated by a comma*_ to weekly tasks\n*Example:* add buy books,buy shoes, buy bags to weekly tasks\n\n _• To view all tasks for the week_, \nsimply text me : \n\nview weekly tasks\n\n _• To remove tasks from the list, simply text me:_ \n\nremove _*task name here*_ from weekly tasks\n*Example:* remove buy books from weekly tasks\n\n _• To remove multiple tasks from the list, simply text me:_ \n\nremove _*task names here separated by a comma*_ from weekly tasks\n*Example:* remove buy books, buy shoes, buy bags from weekly tasks\n\n_*NOTE:-*_\nWeekly tasks reset everyweek on monday, your time!`)
    }

    else if(noteWords.includes(menuOption.toLowerCase())) {
        await chat.sendMessage(`Hey there! I see you need help with the _*Notes*_ Module I have.\nIt's very simple and easy to use!\nHere let me show you haha-\n\n _• To add a new note_, simply text me : \n\nnew note _*note name here (only 1 word)*_ _*your note here*_\n*Example:* new note physics its a subject\n\n _• To view a note, simply text me:_ \n\nview note _*note ID here*_ \n*Example:* view note hq6k\n\n _• To view all notes_, simply text me : \n\nshow all notes\n\n _• To remove a note, simply text me:_ \n\ndelete note _*note ID here*_\n*Example:* delete note hq6k\n\n _• To remove multiple notes, simply text me:_ \n\ndelete notes _*note IDs here separated by a comma*_\n*Example:* delete note hq6k, abdf, kqjh`)
    }

    else {
        return chat.sendMessage(`Are you sure you are asking me help for the correct option?`)
    }
}

module.exports = { send, send2 };