const { current } = require("../assets/time")
 
const fetch = require("node-fetch")

//models
const userDB = require("../models/reminder");

async function at(message) {
    const chat = (await message.getChat());
    const user = userDB.findOne({ ChatOD: chat.id._serialized });
    if(!user) return chat.sendMessage(`test`)
    const time = message.body.toLowerCase().replace("remind me at ", "").split(" for ")[0];
    const reminderAbout = message.body.toLowerCase().replace("remind me at ", "").split(" for ")[1];
    
    const userCurrentTimezone = await current(user.timezone);
    var userCurrentTime;
    await fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=MBNTOG0XU4N1&format=json&by=zone&zone=${userCurrentTimezone}`)
    .then(res => res.json)
    .then(json => userCurrentTime = parseInt(json.timestamp) * 1000);

    if(time.includes("pm") || time.includes("am")) {
        
        var time2;
        var time3;
        var time4;
        var timeFinal;
        
        if(time.includes("pm")) {
            time2 = time.split("pm")[0];
            if(time2.includes(":")) {
                time3 = parseInt(time2.split(":")[0]) * 3600000;
                time4 = parseInt(time2.split(":")[1]) * 60000;
                timeFinal = parseInt(time3 + time4);



            }
        }

    }

}

async function after(message) {
    const chat = (await message.getChat());
    const user = userDB.findOne({ ChatOD: chat.id._serialized });
    if(!user) return chat.sendMessage(`test`);
    const time = message.body.toLowerCase().replace("remind me after ", "").split(" for ")[0];
    const reminderAbout = message.body.toLowerCase().replace("remind me after ", "").split(" for ")[1];

    const userCurrentTime = await current(user.timezone);
}

module.exports = { after, at }