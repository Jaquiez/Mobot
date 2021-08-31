const { MessageEmbed, Message, Channel, TextChannel } = require("discord.js");

module.exports = {
    names: ['nuke'],
    description: 'Destroys the current channel and creates a new one with the same properties',
    permissions: ["MANAGE_CHANNELS"],

    //Nukes the channel but if you nuke it multiple times while the bot is online it will create multiple nuke messages
    //Fixed to use a .then instead of event because event would send nuke message multiple times
    async execute(client, message, args, Discord) {
        await message.channel.clone().then(clone => {
            const embed = new Discord.MessageEmbed()
                .setTitle('Channel has been nuked')
                .setDescription('Goodbye to all your old messages ;(')
                .setColor('#ff1122')
                .setImage('https://media1.tenor.com/images/f4ae445388be803fa8a69870962f98cc/tenor.gif');
            clone.send(embed);
        })
        message.channel.delete('nuked');    
        
    }
}