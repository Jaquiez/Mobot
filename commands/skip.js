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

}

module.exports = {
    perms: [],
    desc: "MoBot will skip the current song",
    execute
}
