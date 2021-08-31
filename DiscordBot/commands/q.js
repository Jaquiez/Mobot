
module.exports = {
    names: ['q','queue'],
    description: 'Displays the songs in the queue',
    permissions: [],
    //PLEASE REWORK THIS
    async execute(client, message, args, Discord, queue) {
        const serverQueue = await queue.get(message.guild.id);
        var ting = "";
        var lastPage = serverQueue.songs.length/10;
        const setQMessage = (pageNumber)=>{
            var q = "";
            var len = pageNumber*10;
            if(pageNumber*10 > serverQueue.songs.length)
            {
                len = serverQueue.songs.length;
            }
            for (k = 10 * (pageNumber - 1); k < len; k++) {
                q += (parseInt(k) + 1) + ".) " + `| [${serverQueue.songs[k].title}](${serverQueue.songs[k].url})` + ` | ${serverQueue.songs[k].length} \n`;
            }
            return q;
        }
        if (serverQueue !== undefined) {
            var pageNumber = 1;
            if (serverQueue.songs.length > 10) {
                ting = setQMessage(pageNumber);
            }
            else {
                for (var key in serverQueue.songs) {
                    ting += (parseInt(key) + 1) + ".) " + `[${serverQueue.songs[key].title}](${serverQueue.songs[key].url})` + ` | ${serverQueue.songs[key].length} \n`;
                }
            }
            if (ting.length > 2000) {
                ting = ting.substring(0, 2000)
            }
            const checkForReactions = (msg)=>
            {
                const filter = (reaction,user) => ['⬅️','➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
                msg.react('⬅️');
                msg.react('➡️');
                msg.awaitReactions(filter, {max:1, time: 100000}).then(collected =>{                   
                    const reaction = collected.first();
                    if(reaction._emoji.name === '⬅️' && pageNumber>1)
                    {
                        pageNumber--;
                        embed.setDescription(setQMessage(pageNumber));
                        msg.edit(embed);
                        msg.reactions.removeAll();
                    }
                    else if(reaction._emoji.name === '➡️' && pageNumber<lastPage)
                    {
                        pageNumber++;
                        embed.setDescription(setQMessage(pageNumber));
                        msg.edit(embed);
                        msg.reactions.removeAll();
                    }
                    checkForReactions(msg);
                }).catch(err=>{
                    console.error(err);
                    return;
                })
            }
            const embed = new Discord.MessageEmbed()
                .setTitle(`Queue | ${serverQueue.songs.length} songs`)
                .setDescription(`${ting}`)
                .setColor('#7508cf')
            message.channel.send(embed).then((msg) => {
                checkForReactions(msg);
                setTimeout(() => {
                    msg.delete();
                    return;
                }, 120000);
            })
        }
        else {
            return message.channel.send("No songs are in the queue!");
        }

    }
}