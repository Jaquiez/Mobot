//npm install dotenv
//npm install images-scraper

require("dotenv").config();
const Discord = require('discord.js');

const client = new Discord.Client();

//new event and command handler bullshit, idk how it works but it does
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
})


//welcome message and role assignment
client.on("guildMemberAdd", (member) => {
    const welcomeChannelId = '604510005365833740' //channel ID of wherever you want the welcome messages to be sent
    const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId)

    const embed = new Discord.MessageEmbed()
        .setTitle('RETARD ALERT')
        .setDescription(`Welcome <@${member.id}> to the shithole`)
        .setColor('#ff1122')
        .setImage('https://media1.tenor.com/images/f4500ab70d99a48fffc974f6c6ca3178/tenor.gif?itemid=20423677');

    welcomeChannel.send(embed);

    const welcomeRole = member.guild.roles.cache.find(role => role.name === 'Infidel'); //exact name of role to be assigned on join
    member.roles.add(welcomeRole);
});

client.login(process.env.TOKEN);