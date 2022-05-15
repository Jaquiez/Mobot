const { AudioPlayer, AudioResource, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice')
const {MessageEmbed} = require('discord.js');
const queuehandler = require('../handlers/queuehandler');
const ytdl = require('ytdl-core')
let player;
async function playSong(serverQueue,guildId,message) {
    if(serverQueue.songs.length==0)
    {
        queuehandler.masterQueue.delete(guildId);
        serverQueue.connection.destroy();
        return;
    }
    let song = serverQueue.songs[0];
    const embed = new MessageEmbed()
        .setTitle(`Now playing`)
        .setDescription(`**${song.title}** | Requested by ${song.requester}`);
    
    const msg = await message.channel.send({embeds:[embed]});
    player = new AudioPlayer()
        .on(AudioPlayerStatus.Idle,()=>{
            serverQueue.songs.shift();
            msg.delete();
            playSong(serverQueue,guildId,message);
        })
    const stream = ytdl(song.url, {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    });
    let resource = createAudioResource(stream);
    player.play(resource);
    serverQueue.player = player;
    serverQueue.connection.subscribe(player);
}
module.exports = { playSong, player }