const tasksDB = require("../models/tasks");
const groceryDB = require("../models/grocery");
const userDB = require("../models/user")
const { daily, greeting, week, noteWords, grocery, remind } = require("../assets/words");

async function remove(message) {

    const chat = (await message.getChat());
    const db = await userDB.findOne({ChatID: chat.id._serialized});
    if(!db || db === null || db === undefined) {
        return chat.sendMessage(`Your Account was not found! \nPlease start making the account by first telling us your name!\n\nPlease register/make an account on our website to get started!\nhttps://rekol.herokuapp.com/users/register`)
    }

    const items = [`${message.body.toLowerCase().replace("remove ", "").split(" from ")[0]}`];
    var item;
    if(items[0].includes(",")) { item = items[0].split(",");}
    else { item = [`${items[0].trim()}`]}
    
    

    const list = message.body.toLowerCase().replace("remove ", "").split(" from ")[1];

    if(!list || !item || !list === undefined || !item === undefined || !list === null || !item === null) {
        return chat.sendMessage(`Are you sure you are following the format? \nEg: remove *maggi* from *grocery list*`);
    }

//================================================================================
// Remove from weekly task
//================================================================================
    if(week.includes(list.toLowerCase())) {
        
        item.forEach(async element => {
            await tasksDB.findOneAndUpdate({ChatID : chat.id._serialized}, {$pull: {weeklyTasks: element.replace(/^\s*|\s*$/g, '')}}).catch(err => console.log(err));
        });
    
        return chat.sendMessage(`Okay done! I have removed \n_*${item.join(`\n`)}*_ \nfrom _*${list}*_!\n\nTo know all the entries in the list, send me a message as follows!\n\n_*view ${list}*_`)

    }


//================================================================================
// Remove from daily task
//================================================================================
    else if(daily.includes(list.toLowerCase())) {
        
        item.forEach(async element => {
            await tasksDB.findOneAndUpdate({ChatID : chat.id._serialized}, {$pull: {dailyTasks: element.replace(/^\s*|\s*$/g, '')}}).catch(err => console.log(err));
        });
    
        return chat.sendMessage(`Okay done! I have removed \n_*${item.join(`\n`)}*_ \nfrom _*${list}*_!\n\nTo know all the entries in the list, send me a message as follows!\n\n_*view ${list}*_`)

    }


//================================================================================
// Remove from grocery
//================================================================================
    else if(grocery.includes(list.toLowerCase())) {
        
        item.forEach(async element => {
            await groceryDB.findOneAndUpdate({ChatID : chat.id._serialized}, {$pull: {Grocery: element.replace(/^\s*|\s*$/g, '')}}).catch(err => console.log(err));
        });
    
        return chat.sendMessage(`Okay done! I have removed _*${item.join(`, `)}*_ from _*${list}*_!\n\nTo know all the entries in the list, send me a message as follows!\n\n_*view ${list}*_`)

    }

//================================================================================
// Else just send a message
//================================================================================
    else {
        return chat.sendMessage(`An error occured while removing _${item}_ from _${list}_ !\n\n Are you sure you are removing the items from the correct list?`);
    }

}


module.exports = { remove }