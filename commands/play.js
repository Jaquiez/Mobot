const {joinVoiceChannel, entersState, VoiceConnectionStatus} = require('@discordjs/voice');
const queuehandler = require('../handlers/queuehandler');
const { linkify } = require('../handlers/songhandler');
const player = require('../player/player');
async function execute(message,client) {
    let guildId = message.channel.guildId;
    if(!queuehandler.masterQueue.has(guildId))
    {
        const errnum = await require('./join.js').execute(message,client);
        if(errnum===-1)
            return;
    }
    let args = message.content.substring(message.content.indexOf(' ')+1);
    let songs = await linkify(args,message);
    let serverQueue = queuehandler.masterQueue.get(guildId);
    songs.forEach(song=>{
        serverQueue.songs.push(song)
    });
    if(serverQueue.player==null)
    {
        player.playSong(serverQueue,guildId,message);
    }

}

module.exports = {
    altnames: ['p'],
    perms: [],
    desc: "MoBot will play the song in the [argument]",
    execute
}
