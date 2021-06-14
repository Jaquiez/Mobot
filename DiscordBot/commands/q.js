
module.exports = {
    name: 'q',
    description: 'Displays the songs in the queue',
    permissions: [],
    //PLEASE REWORK THIS
    async execute(client, message, args, Discord, queue) {
        const serverQueue = await queue.get(message.guild.id);
        var ting = "";
        if (serverQueue !== undefined) {
            if (serverQueue.songs.length > 10) {
                for (k = 0; k < 10; k++) {
                    ting += (parseInt(k) + 1) + ".) " + `[${serverQueue.songs[k].title}](${serverQueue.songs[k].url})` + "\n";
                }
            }
            else {
                for (var key in serverQueue.songs) {
                    ting += (parseInt(key) + 1) + ".) " + `[${serverQueue.songs[key].title}](${serverQueue.songs[key].url})` + "\n";
                }
            }

            if (ting.length > 2000) {
                ting = ting.substring(0, 2000)
            }
            const embed = new Discord.MessageEmbed()
                .setTitle(`Queue | ${serverQueue.songs.length} songs`)
                .setDescription(`**${ting}**`)
                .setColor('#7508cf')
            message.channel.send(embed).then((msg) => {
                console.log('\??');
                msg.react('??').catch((err) => {
                    console.error("An error has occured -> " + err);
                })
            })
            await setTimeout(() => {
                return;
            }, 300000);
        }
        else {
            return message.channel.send("No songs are in the queue!");
        }

    }
}