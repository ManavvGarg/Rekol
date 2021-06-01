const tasksDB = require("../models/tasks");
const groceryDB = require("../models/grocery");
const userDB = require("../models/user")
const { daily, greeting, week, noteWords, grocery, remind } = require("../assets/words");


async function view(message) {

    const chat = (await message.getChat());
    const list = message.body.toLowerCase().replace("view ", "");

    //grocery list
    if(grocery.includes(list.toLowerCase())) {
        const db = await userDB.findOne({ChatID: chat.id._serialized});
        if(!db || db === null || db === undefined) {
            return chat.sendMessage(`Your Account was not found! \nPlease start making the account by first telling us your name!\n\nPlease register/make an account on our website to get started!\nhttps://rekol.herokuapp.com/users/register`)
        }

        const itemDB = await groceryDB.findOne({ChatID: chat.id._serialized});
        const items = itemDB.Grocery;

        if(!items || items === undefined || items === null || items === []) return chat.sendMessage(`Your Grocery list is empty :(\nTry adding items in the list!\n\n _• To add items in a list, simply text me:_ \n\nadd _*item name here*_ to grocery list\n\n _• To add multiple items in the list, simply text me:_ \n\nadd _*item names here separated by a comma*_ to grocery list`)
        const text = `${await items.join(`\n`)}`;
        if(!text || text === undefined || text === null || text === '' || text === []) return chat.sendMessage(`Your Grocery list is empty :(\nTry adding items in the list!\n\n _• To add items in a list, simply text me:_ \n\nadd _*item name here*_ to grocery list\n\n _• To add multiple items in the list, simply text me:_ \n\nadd _*item names here separated by a comma*_ to grocery list`)
        return chat.sendMessage(`Here is your Grocery List!\n\n${text}`);

    }


    //daily tasks
    else if(daily.includes(list.toLowerCase())) {
        const db = await userDB.findOne({ChatID: chat.id._serialized});
        if(!db || db === null || db === undefined) {
            return chat.sendMessage(`Your Account was not found! \nPlease start making the account by first telling us your name!\n\nPlease register/make an account on our website to get started!\nhttps://rekol.herokuapp.com/users/register`)
        }
        
        const itemDB = await tasksDB.findOne({ChatID: chat.id._serialized});
        const items = itemDB.dailyTasks;

        if(!items || items === undefined || items === null || items === []) return chat.sendMessage(`There are no daily tasks available!\nTry adding tasks in the list!\n\n _• To add a task_, \nsimply send me a message following the below format! : \n\nadd _*task name here*_ to daily tasks\n\n _• To add multiple tasks in the list, simply text me:_ \n\nadd _*tasks here separated by a comma*_ to daily tasks`)
        const text = `${await items.join(`\n`)}`;
        if(!text || text === undefined || text === null || text === '' || text === []) return chat.sendMessage(`There are no daily tasks available!\nTry adding tasks in the list!\n\n _• To add a task_, \nsimply send me a message following the below format! : \n\nadd _*task name here*_ to daily tasks\n\n _• To add multiple tasks in the list, simply text me:_ \n\nadd _*tasks here separated by a comma*_ to daily tasks`)
        return chat.sendMessage(`Here are your Tasks for today!\n\n${text}`);
    
    }
    

    //Weekly tasks
    else if(week.includes(list.toLowerCase())) {        
    const db = await userDB.findOne({ChatID: chat.id._serialized});
    if(!db || db === null || db === undefined) {
        return chat.sendMessage(`Your Account was not found! \nPlease start making the account by first telling us your name!\n\nPlease register/make an account on our website to get started!\nhttps://rekol.herokuapp.com/users/register`)
    }
    
    const itemDB = await tasksDB.findOne({ChatID: chat.id._serialized});
    const items = itemDB.weeklyTasks;

        if(!items || items === undefined || items === null) return chat.sendMessage(`There are no weekly tasks available!\nTry adding tasks in the list!\n\n _• To add a task_, \nsimply send me a message following the below format! : \n\nadd _*task name here*_ to weekly tasks\n\n _• To add multiple tasks in the list, simply text me:_ \n\nadd _*tasks here separated by a comma*_ to weekly tasks`)
        const text = `${await items.join(`\n`)}`;
        if(!text || text === undefined || text === null || text === '' || text === []) return chat.sendMessage(`There are no weekly tasks available!\nTry adding tasks in the list!\n\n _• To add a task_, \nsimply send me a message following the below format! : \n\nadd _*task name here*_ to weekly tasks\n\n _• To add multiple tasks in the list, simply text me:_ \n\nadd _*tasks here separated by a comma*_ to weekly tasks`)
        return chat.sendMessage(`Here are your Weekly Tasks!\n\n${text}`);

    }

    else {
        return chat.sendMessage(`Are you sure you are typing the name of the list correctly? It is :\n\n"grocery list" for grocery list,\n"daily tasks" for daily tasks list, and\n"weekly tasks" for weekly tasks list!`)
    }

}

module.exports = { view }