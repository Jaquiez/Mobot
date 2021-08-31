const fs = require('fs');

module.exports = (client, Discord) => {
    const command_files = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

    for (const file of command_files) {
        //Embeds file name into const command
        const command = require(`../commands/${file}`);
        if (command.names) {
            command.names.forEach(element => {
                client.commands.set(element, command);
            });
        } else {
            continue;
        }
    }
}