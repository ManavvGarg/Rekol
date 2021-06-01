async function status(message) {
    const contact = await message.getContact();
    if(!contact.number === "9818094442") return;
    const newStatus = message.body.split('!status ')[1];
    await bot.setStatus(newStatus);
    message.reply(`Status was updated to *${newStatus}*`); 

}

module.exports = { status }