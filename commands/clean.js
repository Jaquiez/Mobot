const {Permissions} = require('discord.js')
async function execute(message,client) {
    let args = message.content.split(' ').slice(1);
    let num= parseInt(args[0]);
    if(isNaN(num) || num < 1 || num > 99)
    {
        message.channel.send(`You tried cleaning ${num} messages, pick a number between 1-99`);
        return;
    }
    message.channel.bulkDelete(num+1,true)
}

module.exports = {
    perms: [Permissions.FLAGS.MANAGE_MESSAGES],
    desc: "Removes [argument] messages",
    execute
}
