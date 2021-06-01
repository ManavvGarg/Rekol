const tasksDB = require("../models/tasks");
const groceryDB = require("../models/grocery");
const userDB = require("../models/user")


const { daily, greeting, week, noteWords, grocery, remind } = require("../assets/words");

async function add(message) {
    const chat = (await message.getChat());
    const items = [`${message.body.toLowerCase().replace("add ", "").split(" to ")[0]}`];
    var item;
    if(items[0].includes(",")) { item = items[0].split(",");}
    else { item = [`${items[0].trim()}`]}
    
    
    const list = message.body.toLowerCase().replace("add ", "").split(" to ")[1];

    if(!list || !item || !list === undefined || !item === undefined || !list === null || !item === null) {
        return chat.sendMessage(`Are you sure you are following the format? \nExamples:\n1) add *maggi* to *grocery list*\n2)add *Workout* to *daily tasks*`);
    }

    const db = await userDB.findOne({ChatID: chat.id._serialized});
    if(!db || db === null || db === undefined) {
        return chat.sendMessage(`Your Account was not found! \nPlease start making the account by first telling us your name!\n\nPlease register/make an account on our website to get started!\nhttps://rekol.herokuapp.com/users/register/`)
    }

    //Weekly list
    if(week.includes(list.toLowerCase())) {
        
        item.forEach(async element => {
            await tasksDB.findOneAndUpdate({ChatID : chat.id._serialized}, {$addToSet: {weeklyTasks: element.replace(/^\s*|\s*$/g, '')}}).catch(err => console.log(err));
        });
    
        return chat.sendMessage(`Okay done! I have added _*${item.join(`, `)}*_ to _*${list}*_!\n\nTo know all the entries in the list, send me a message as follows!\n\n_*view ${list}*_`)

    }


    //daily list
    else if(daily.includes(list.toLowerCase())) {
        
        item.forEach(async element => {
            await tasksDB.findOneAndUpdate({ChatID : chat.id._serialized}, {$addToSet: {dailyTasks: element.replace(/^\s*|\s*$/g, '')}}).catch(err => console.log(err));
        });
    
        return chat.sendMessage(`Okay done! I have added _*${item}*_ to _*${list}*_!\n\nTo know all the entries in the list, send me a message as follows!\n\n_*view ${list}*_`)

    }


    //grocery list
    else if(grocery.includes(list.toLowerCase())) {
        
        item.forEach(async element => {
            await groceryDB.findOneAndUpdate({ChatID : chat.id._serialized}, {$addToSet: {Grocery: element.replace(/^\s*|\s*$/g, '')}}).catch(err => console.log(err));
        });
    
        return chat.sendMessage(`Okay done! I have added _*${item}*_ to _*${list}*_!\n\nTo know all the entries in the list, send me a message as follows!\n\n_*view ${list}*_`)

    }
    
    else {
        return chat.sendMessage(`An error occured while adding _${item}_ to _${list}_ !\n\n Are you sure you are adding the item to correct list?`);
    }

}


module.exports= { add } 