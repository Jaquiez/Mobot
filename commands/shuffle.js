const {joinVoiceChannel, entersState, VoiceConnectionStatus, AudioPlayerStatus} = require('@discordjs/voice');
const queuehandler = require('../handlers/queuehandler');
async function execute(message,client) {
    
    let guildId = message.channel.guildId;
    if(!queuehandler.masterQueue.has(guildId))
    {
        message.channel.send("I'm not in a channel!");
        return;
    }
    let songs = queuehandler.masterQueue.get(guildId).songs;
    for(let s=1;s<songs.length;s++)
    {
        let temp = songs[s];
        let rand = Math.floor(Math.random()*songs.length-1);
        songs[s] = songs[rand];
        songs[rand] = temp;
    }
    queuehandler.masterQueue.get(guildId).songs = songs;
    message.channel.send(`Finished shuffling ${songs.length} songs`);
}

module.exports = {
    perms: [],
    desc: "MoBot will shuffle",
    execute
}
