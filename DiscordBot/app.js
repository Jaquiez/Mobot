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
        else
        {
            message.channel.send("You don't have the permissions to do this! " + `${message.author}`);
        }
    }
    else if (command == 'nuke')
    {
        client.commands.get('nuke').execute(message, args);
    }


});
client.login(process.env.TOKEN);