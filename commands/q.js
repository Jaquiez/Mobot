const queuehandler = require('../handlers/queuehandler');
const { MessageEmbed, Collection, ReactionCollector } = require('discord.js');
function getList(num, songs) {
    let data = "";
    var len = num * 10;
    if (len > songs.length) {
        len = songs.length;
    }
    for (let s = (num - 1) * 10; s < len; s++) {
        data = data + `${s + 1}.) **${songs[s].title}** | ${songs[s].length} | ${songs[s].requester}\n`;
    }
    return data;
}
function getSongTime(serverQueue){
    let time = 0;
    try{
        time = new Date(serverQueue.player._state.playbackDuration).toISOString().substring(11,19)
    }catch(e){
        console.log(e);
        return '?';

    }
    return time;
}
async function execute(message, client) {

    let guildId = message.channel.guildId;
    let num = 1;
    if (!queuehandler.masterQueue.has(guildId)) {
        message.channel.send("I'm not in a channel!");
        return;
    }
    let serverQueue = queuehandler.masterQueue.get(guildId);
    let embed = await new MessageEmbed()
        .setTitle(`Queue: Currently playing -> ${serverQueue.songs[0].title} | ${getSongTime(serverQueue)}`)
        .setDescription(getList(num, serverQueue.songs));
    message.channel.send({ embeds: [embed] }).then((msg)=> {
        setTimeout(()=>{
            msg.delete();
            return;
        },120000)
        function checkReact(msg){
            msg.react('⬅️');
            msg.react('➡️');
            const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction._emoji.name) && user.id === message.author.id;
        
            msg.awaitReactions({ filter, max: 1, time: 120000 }).then(collected => {
                const reaction = collected.first();
                try{
                    if (reaction.emoji.name === '⬅️' && num > 1)
                    num--;
                else if (reaction.emoji.name === '➡️' && num < (serverQueue.songs.length / 10))
                    num++;
                }
                catch(e)
                {
                    console.log(e)
                    return;
                }
                embed.setTitle(`Queue: Currently playing -> ${serverQueue.songs[0].title} | ${getSongTime(serverQueue)}`)
                embed.setDescription(getList(num,serverQueue.songs));
                msg.edit({ embeds: [embed] });
                msg.reactions.removeAll();
                checkReact(msg);
        
            })
        }
        checkReact(msg);
    });


}

module.exports = {
    perms: [],
    desc: "MoBot will play the song in the [argument]",
    execute
}
