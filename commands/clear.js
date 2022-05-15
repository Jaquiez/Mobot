const {joinVoiceChannel, entersState, VoiceConnectionStatus, AudioPlayerStatus} = require('@discordjs/voice');
const queuehandler = require('../handlers/queuehandler');
async function execute(message,client) {
    
    let guildId = message.channel.guildId;
    if(!queuehandler.masterQueue.has(guildId))
    {
        message.channel.send("I'm not in a channel!");
        return;
    }
    queuehandler.masterQueue.get(guildId).player.stop();
    queuehandler.masterQueue.get(guildId).songs = [];
    message.channel.send("Cleared the queue!");
}

module.exports = {
    perms: [],
    desc: "MoBot will clear all songs in the queue and skip the current song",
    execute
}
