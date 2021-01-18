require("dotenv").config();
const Discord = require('discord.js');

const client = new Discord.Client();

const prefix = '.';


client.once('ready', () => {
    console.log('OgreBot is online!')
});

const fs = require('fs');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'))

//pretty much a foreach loop in js, just make it foreach man
for (const file of commandFiles) {
    //Embeds file name into const command
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}


client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();   

    if (command.startsWith('clear')) {
        if (message.member.hasPermission('MANAGE_MESSAGES')) {
            client.commands.get('clear').execute(message, args);
        }
        else {
            message.channel.send("You don't have the permissions to do this! " + `${message.author}`);
        }
    }
    else if (command.startsWith('mute')) {
        if (message.member.hasPermission('MUTE_MEMBERS')) {
            client.commands.get('mute').execute(message, args);
        }
        else {
            message.channel.send("You don't have the permissions to do this! " + `${message.author}`);
        }
    }
    else if (command.startsWith('unmute')) {
        if (message.member.hasPermission('MUTE_MEMBERS')) {
            client.commands.get('unmute').execute(message, args);
        }
        else {
            message.channel.send("You don't have the permissions to do this! " + `${message.author}`);
        }
    }
    else if (command === 'nuke') {
        if (message.member.hasPermission('MANAGE_CHANNELS')) {
            client.commands.get('nuke').execute(message, args, Discord, client);
            return;
        }
        else {
            message.channel.send("You don't have the permissions to do this! " + `${message.author}`);
        }
    }
    else if (command === 'ban') {
        if (message.member.hasPermission('BAN_MEMBERS')) {
            client.commands.get('ban').execute(message, args);
        }
        else {
            message.channel.send("You don't have the permissions to do this! " + `${message.author}`);
        }
    }
    else if (command === 'kick') {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            client.commands.get('kick').execute(message, args);
        }
        else {
            message.channel.send("You don't have the permissions to do this! " + `${message.author}`);
        }
    }

});
client.login(process.env.TOKEN);