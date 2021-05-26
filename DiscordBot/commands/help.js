module.exports = {
    name: 'help',
    description: 'Actually why the fuck do you need help with the help command? What a fucking ape',
    permissions: [],

    async execute(client, message, args, Discord) {

        try {
            var cmd = args.shift().toLowerCase();
            var command = client.commands.get(cmd);

        } catch (error) {
            return message.channel.send('say the command you want help with idiot');
        }

        var permissions = '';
        for (const perm of command.permissions) {
            permissions += (perm + ', ');
        }
        permissions = permissions.substring(0, permissions.length - 2);

        var embed;
        if (permissions.length > 0) {
            embed = new Discord.MessageEmbed()
                .setTitle(command.name + ' command info')
                .setDescription(command.description + ', and requires the following perm(s): ' + permissions)
                .setColor('#ff1122')
        } else {
            embed = new Discord.MessageEmbed()
                .setTitle(command.name + ' command info')
                .setDescription(command.description + ', and doesn\'t require any perms to use')
                .setColor('#ff1122')
        }
        

        message.channel.send(embed);
    }

}