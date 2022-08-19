const { AudioPlayer, AudioResource, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice')
const { MessageEmbed } = require('discord.js');
const queuehandler = require('../handlers/queuehandler');
const ytdl = require('ytdl-core')
const play = require('play-dl')
let player;
async function playSong(serverQueue, guildId, message) {
    if (serverQueue.songs.length == 0) {
        queuehandler.masterQueue.delete(guildId);
        serverQueue.connection.destroy();
        return;
    }
    let song = serverQueue.songs[0];
    const embed = new MessageEmbed()
        .setTitle(`**Now playing ↓ | Loop status ${serverQueue.loop}**`)
        .setDescription(`[${song.title}](${song.url}) | Requested by ${song.requester}`);

    const msg = await message.channel.send({ embeds: [embed] });
    player = new AudioPlayer()
        .on(AudioPlayerStatus.Idle, () => {
            if (!serverQueue.loop)
                serverQueue.songs.shift();
            msg.delete();
            playSong(serverQueue, guildId, message);
        })
        .on('error', (e) => {
            serverQueue.songs.shift();
            embed.setTitle("An error has occurred");
            embed.setDescription(`${e}`);
            msg.edit({ embeds: [embed] });
            setTimeout(() => {
                msg.delete();
            }, 5000)
            playSong(serverQueue, guildId, message);
        })
    play.setToken({
        youtube: {
            cookie: `${process.env.YT_COOKIE}`
        }
    })
    let stream = await play.stream(song.url);
    let resource = createAudioResource(stream.stream, {
        inputType: stream.type
    });

    player.play(resource);
    serverQueue.player = player;
    serverQueue.connection.subscribe(player);
}
module.exports = { playSong, player }