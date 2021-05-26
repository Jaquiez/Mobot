module.exports = {
    name: 'help',
    description: 'Actually why the fuck do you need help with the help command? What a fucking ape.',
    permissions: [],

    async execute(client, message, args, Discord) {

        try {
            var cmd = args.shift().toLowerCase();
            var command = client.commands.get(cmd);

        } catch (error) {
            return message.channel.send('say the command you want help with idiot');
        }
        

        

        const embed = new Discord.MessageEmbed()
            .setTitle(command.name + ' command info')
            .setDescription(command.description)
            .setColor('#ff1122')

        message.channel.send(embed);
    }

}