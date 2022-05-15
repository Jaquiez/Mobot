const {joinVoiceChannel, entersState, VoiceConnectionStatus} = require('@discordjs/voice');
const queuehandler = require('../handlers/queuehandler');
async function execute(message,client) {
    
    let guildId = message.channel.guildId;
    if(!queuehandler.masterQueue.has(guildId))
    {
        message.channel.send("I'm not in a channel!");
    }
    queuehandler.masterQueue.get(guildId).connection.destroy();
    queuehandler.masterQueue.delete(guildId);
}

module.exports = {
    perms: [],
    desc: "MoBot will play the song in the [argument]",
    execute
}
