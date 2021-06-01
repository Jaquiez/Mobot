
module.exports = {
    name: 'q',
    description: '',
    permissions: [],

    //Nukes the channel but if you nuke it multiple times while the bot is online it will create multiple nuke messages
    async execute(client, message, args, Discord, queue) {
        const serverQueue = queue.get(message.guild.id);
        var ting = "";
        if (serverQueue !== undefined) {
            for (var key in serverQueue.songs) {
                ting += (parseInt(key) + 1) + ".) ";
                for (var kay in serverQueue.songs[key]) {
                    ting += serverQueue.songs[key][kay] + " | ";
                }
                ting += "\n";
            }
            const embed = new Discord.MessageEmbed()
                .setTitle(`Queue`)
                .setDescription(` **${ting}**`)
                .setColor('#7508cf')
            message.channel.send(embed);
        }
        else {
            message.channel.send("No songs are in the queue!");
        }

    }
}