const {MessageEmbed} = require('discord.js');
async function execute(message,client) {
    let help = "";
    require('../handlers/command_handler.js').commands.forEach(command=>{
        help = help + `**${command.name}**: ${command.desc}\n`;
    })
    const embed = new MessageEmbed()
        .setTitle('Commands')
        .setDescription(help)
    message.channel.send({embeds:[embed]});    
}

module.exports = {
    perms: [],
    desc: "bruh :|",
    execute
}
    