const {joinVoiceChannel, entersState, VoiceConnectionStatus} = require('@discordjs/voice');
const queuehandler = require('../handlers/queuehandler');
async function execute(message,client) {
    
    let guildId = message.channel.guildId;
    if(!queuehandler.masterQueue.has(guildId))
    {
        message.reply("I'm not in a voice channel?");
        return;
    }
    queuehandler.masterQueue.get(guildId).connection.destroy();
    queuehandler.masterQueue.get(guildId).player.stop();
    queuehandler.masterQueue.delete(guildId);
}

module.exports = {
    perms: [],
    desc: "MoBot will leave the channel and delete the queue",
    execute
}
