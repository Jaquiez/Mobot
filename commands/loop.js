const {joinVoiceChannel, entersState, VoiceConnectionStatus} = require('@discordjs/voice');
const queuehandler = require('../handlers/queuehandler');
const { MessageEmbed} = require('discord.js');

async function execute(message,client) {
    
    let guildId = message.channel.guildId;
    if(!queuehandler.masterQueue.has(guildId))
    {
        message.channel.send("I'm not in a channel!");
    }
    if(!queuehandler.masterQueue.get(guildId).loop)
        queuehandler.masterQueue.get(guildId).loop = true;
    else
        queuehandler.masterQueue.get(guildId).loop = false;
    let embed = new MessageEmbed()
        .setTitle("Music player")
        .setDescription(`Loop status is now **${queuehandler.masterQueue.get(guildId).loop}**`);
    message.channel.send({embeds:[embed]});

}

module.exports = {
    perms: [],
    desc: "MoBot will loop the current song",
    execute
}
