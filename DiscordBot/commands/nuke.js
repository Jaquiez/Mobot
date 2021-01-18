const { MessageEmbed, Message, Channel, TextChannel } = require("discord.js");

module.exports = {
    name: 'nuke',
    description: 'destroys current channel and creates new one with same properties',

    //Nukes the channel but if you nuke it multiple times while the bot is online it will create multiple nuke messages
    execute(message, args, Discord, client) {
        message.channel.clone();    
        message.channel.delete('nuked');    
        client.on('channelCreate', channel => {
            const embed = new Discord.MessageEmbed()
                .setTitle('Channel has been nuked')
                .setDescription('Goodbye to all your old messages ;(')
                .setColor('#ff1122')
                .setImage('https://media1.tenor.com/images/f4ae445388be803fa8a69870962f98cc/tenor.gif');
            channel.send(embed);
        });
    }
}