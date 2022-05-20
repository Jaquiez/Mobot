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
    let args = message.content.split(' ').slice(1);
    let num= parseInt(args[0])-1;
    if(isNaN(num) || num < 1 || num > (songs.length-1))
    {
        message.channel.send(`You tried removing song ${num+1} but it's invalid`);
        return;
    }
    message.channel.send(`Removed ${songs[num].title} from the queue`);
    songs.splice(num,1);
}

module.exports = {
    perms: [],
    desc: "MoBot will shuffle",
    execute
}
