const fs = require('fs');
module.exports = {
    name: 'help',
    description: 'Actually why the fuck do you need help with the help command? What a fucking ape',
    permissions: [],

    async execute(client, message, args, Discord) {

        if (args.length != 0) {
            message.channel.send("Just do .help");
            /*
            try {
                var cmd = args.shift().toLowerCase();
                var command = client.commands.get(cmd);

            } catch (error) {
                return message.channel.send('say the command you want help with idiot');
            }*/
        }
        else {
            const command_files = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
            var commandNames = "";
            for (const file of command_files) {
                var commandName = file.substring(0, file.indexOf('.js'));
                var command = client.commands.get(commandName);
                var permissions = '';
                for (const perm of command.permissions) {
                    permissions += (perm + ', ');
                }
                permissions = permissions.substring(0, permissions.length - 2);
                if (permissions.length > 0) {
                    commandNames += "** __" + commandName + "__ ** \n *" + command.description + ', and requires the following perm(s): ' + permissions + "* \n";
                }
                else {
                    commandNames += "**  __" + commandName + "__ ** \n *" + command.description + ', and requires no perms* ' + " \n";
                }
            }
            var embed = new Discord.MessageEmbed()
                .setTitle('List of commands')
                .setDescription(commandNames)
                .setColor('#ff1122')
            return message.channel.send(embed);
        }

    }

}