
module.exports = {
    name: 'q',
    description: 'Displays the songs in the queue',
    permissions: [],
    //PLEASE REWORK THIS
    async execute(client, message, args, Discord, queue) {
        const serverQueue = await queue.get(message.guild.id);
        console.log(serverQueue.songs);
        var ting = "";
        if (serverQueue !== undefined) {    
            if (serverQueue.songs.length > 10) {
                for (k = 0; k < 10; k++) {
                    ting += (k + 1) + ".) ";
                    for (var kay in serverQueue.songs[k]) {
                        ting += serverQueue.songs[k][kay] + " | ";
                    }
                    ting += "\n";
                }
            }
            else {
                for (var key in serverQueue.songs) {
                    ting += (parseInt(key) + 1) + ".) ";
                    for (var kay in serverQueue.songs[key]) {
                        ting += serverQueue.songs[key][kay] + " | ";
                    }
                    ting += "\n";
                }
            }
            //work around for now, rework to make pages that only display 8-10 songs at a time
            //Also have to figure out the event for switching page on react to the embeded message
            if(ting.length > 2000)
            {
                ting = ting.substring(0,2000)
            }
            const embed = new Discord.MessageEmbed()
                .setTitle(`Queue`)
                .setDescription(`**${ting}**`)
                .setColor('#7508cf')
            message.channel.send(embed);
        }       
        else {
            message.channel.send("No songs are in the queue!");
        }

    }
}