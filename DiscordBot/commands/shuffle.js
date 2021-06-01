module.exports = {
    name: 'shuffle',
    description: 'shuffles the songs in the queue',
    permissions: [],
    async execute(client, message, args, Discord, queue) {
        const serverQueue = await queue.get(message.guild.id);
        if (serverQueue !== undefined) {
            console.log(serverQueue.songs);
            for (k = 1; k < serverQueue.songs.length; k++) {              
                var randomNum = Math.floor(Math.random() * serverQueue.songs.length);
                if (randomNum != 0) {
                    var temp = serverQueue.songs[k];
                    serverQueue.songs[k] = serverQueue.songs[randomNum];
                    serverQueue.songs[randomNum] = temp;
                }
            }
            const embed = new Discord.MessageEmbed()
                .setTitle(`Queue`)
                .setDescription(`**${serverQueue.songs.length} songs have been shuffled**`)
                .setColor('#7508cf')
            message.channel.send(embed);
        }
        else {
            message.channel.send("No songs are in the queue!");
        }

    }
}