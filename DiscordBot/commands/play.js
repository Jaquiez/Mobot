const ytdl = require('ytdl-core');
const { execute } = require('./clear');
const ytSearch = require('yt-search');
const message = require('../events/guild/message');

module.exports = {
    name: 'play',
    description: 'Plays the song specified',
    permissions: [],

    async execute(client, message, args, Discord, queue) {
        //Handles actually playing the video from the queue, at the end of a song it shifts all songs one spot to the left then playings the first song
        const video_player = async (guild, song) => {
            const songQueue = queue.get(guild.id);

            if (!song) {
                songQueue.voice_channel.leave();
                queue.delete(guild.id);
                return;
            }
            const stream = ytdl(song.url, { filter: 'audioonly' });
            songQueue.connection.play(stream, { seak: 0, volume: .5 })
                .on('finish', () => {
                    songQueue.songs.shift();
                    video_player(guild, songQueue.songs[0])
                });
            const embed = new Discord.MessageEmbed()
                .setTitle(`Now playing: ${song.title}`)
                .setDescription(`[${song.title}](${song.url}) | ${message.author}`)
                .setColor('#7508cf')
            message.channel.send(embed);
        }
        //Checks if member is in a voice channel and if bot has perms to speak in channel
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
            return message.channel.send(
                "You need to be in a voice channel to play music!"
            );
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.channel.send(
                "I need the permissions to join and speak in your voice channel!"
            );
        }

        const serverQueue = queue.get(message.guild.id);
        let song = {};

        //Checks if link is sent, if so just take the info from the link
        //If not look up and "find" the video on youtube
        if (ytdl.validateURL(args[0])) {
            const songInfo = await ytdl.getInfo(args[0]);
            song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
            };
        }
        else {
            const find_video = async (query) => {
                const videoResult = await ytSearch(query);
                return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
            }
            const video = await find_video(args.join(' '));
            if (video) {
                song = {
                    title: video.title,
                    url: video.url,
                };
            }
            else {
                message.channel.send("Could not find a video on: " + args.join(' '));
            }
        }
        if (!serverQueue) {
            const queueConstructor = {
                voice_channel: voiceChannel,
                text_channel: message.channel,
                connection: null,
                songs: []
            }
            queue.set(message.guild.id, queueConstructor);
            console.log(song);
            console.log(song.length);
            if ("title" in song) {
                queueConstructor.songs.push(song);
            }
            else
            {
                return;
            }
            try {
                const connection = await voiceChannel.join();
                queueConstructor.connection = connection;
                video_player(message.guild, queueConstructor.songs[0]);
            }
            catch (err) {
                queue.delete(message.guild.id);
                message.channel.send('Could not connect');
                throw err;
            }
        } else {
            if ("title" in song) {
                serverQueue.songs.push(song);
                console.log(serverQueue.songs);
                const embed = new Discord.MessageEmbed()
                    .setTitle(`${song.title} has been added to the queue!`)
                    .setColor('#7508cf')
                return message.channel.send(embed);
            }
            else {
                return;
            }

        }
                

    }

    
}