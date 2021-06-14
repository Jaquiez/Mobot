const ytdl = require('ytdl-core');
var { google } = require('googleapis');
var SpotifyWebApi = require('spotify-web-api-node');
const { exec } = require('child_process');
const fetch = require("node-fetch");
const jsdom = require("jsdom");
const { script } = require('googleapis/build/src/apis/script');
require('dotenv').config()
module.exports = {
    name: 'play',
    description: 'Plays the song specified',
    permissions: [],
    async execute(client, message, args, Discord, queue) {
        //Handles actually playing the video from the queue, at the end of a song it shifts all songs one spot to the left then playings the first song
        const video_player = async (guild, song) => {
            const songQueue = queue.get(guild.id);
            if (songQueue.connection === null) {
                songQueue.connection.play();
            }
            if (!song) {
                queue.delete(guild.id);
                await setTimeout(() => {
                    if (queue.get(guild.id) === undefined){
                        songQueue.voice_channel.leave();
                    }
                }, 300000);
                return;
            }
            const embed = new Discord.MessageEmbed()
                .setTitle(`Now playing: ${song.title}`)
                .setDescription(`[${song.title}](${song.url}) | ${message.author}`)
                .setColor('#7508cf')
            message.channel.send(embed).then(async msg=>
            {
                var finished = false;
                const stream = ytdl(song.url, { filter: 'audioonly' });
                songQueue.connection.play(stream, { seak: 0, volume: 1 })
                    .on('finish', () => {
                        songQueue.songs.shift();
                        msg.delete();
                        video_player(guild, songQueue.songs[0]);
                        finished = true;
                    })
                    .on('error', () =>{
                        songQueue.songs.shift();
                        embed.setTitle(`An error occured when playing -> ${song.title}`)
                        msg.edit(embed);
                        setTimeout(()=>{
                            video_player(guild, songQueue.songs[0]);
                            return msg.delete()
                        },3000); 
                    })
                    .on('close', ()=>{
                        if(!finished)
                        {
                            msg.delete();
                            queue.delete(guild.id);
                            return message.channel.send("I've been disconnected! (So I deleted the queue)");
                        }           
                    });
            })

        }
        //Finds video by getting html page of search query
        //JSDOM is slow so string manipulation works better :)
        const find_video = (query) => {
            return new Promise((resolve,reject) => {
                fetch(encodeURI("https://www.youtube.com/results?search_query=" + query)).then(async function (response) {
                    return response.text();           
                }).then(async function (html) {
                    var parsedScript = html.substring(html.indexOf("var ytInitialData = ")+"var ytInitialData = ".length,1+html.indexOf("};", html.indexOf("var ytInitialData =")))
                    parsedScript = JSON.parse(parsedScript);
                    parsedScript.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents.forEach(item => {
                        if (item.videoRenderer) {
                            song = {
                                title: item.videoRenderer.title.runs[0].text,
                                url: "https://www.youtube.com/watch?v=" + item.videoRenderer.videoId
                            }
                            return resolve(song);
                        }
                    })
                    return resolve(null);
                }).catch(function (err) {                   
                    console.log(encodeURI("https://www.youtube.com/results?search_query=" + query));
                    reject("Something went wrong -> ", err);
                });
            })
        }
        //Gets spotify token by execute shell command
        // Command uses login (id + secret) to be granted an api token, returns api token from JSON provided
        const getSpotifyToken = async(login) =>
        {
            return new Promise(resolve=>
                {               
                    exec(`curl -X "POST" -H "Authorization: Basic ${login}" -d grant_type=client_credentials https://accounts.spotify.com/api/token`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`error: ${error.message}`);
                        return message.channel.send("An error occured");
                    }                          
                    resolve(JSON.parse(stdout).access_token);
            });  
        })
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
        var songsInQ = [];
        //Checks if link is sent, if so just take the info from the link
        //If not look up and "find" the video on youtube
        if (ytdl.validateURL(args[0])) {
            const songInfo = await ytdl.getInfo(args[0]);
            song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
            };
        }
        //Checking if the arguments contains a youtube playlist
        else if (args[0].startsWith("https://www.youtube.com/playlist?list=") || args[0].startsWith("https://youtube.com/playlist?list="))
        {
            function getVideos(url, nextToken) {
                var service = google.youtube('v3');
                return new Promise(resolve => {
                    service.playlistItems.list({
                        "auth": process.env.API_KEY,
                        "part": ["contentDetails", "snippet"],
                        "maxResults": 45,
                        "pageToken": nextToken,
                        "playlistId": url.substring(url.indexOf("list=") + "list=".length)
                    }, async function (err, response) {
                        if (err) {
                            console.log('The API returned an error: ' + err);
                            return;
                        }
                        var playlist = response.data;
                        if (playlist.length == 0) {
                        } else {
                            playlist.items.forEach(element => {
                                song = {
                                    title: element.snippet.title,
                                    url: "https://www.youtube.com/watch?v=" + element.contentDetails.videoId,
                                };
                                songs.push(song);
                            })
                            if (playlist.nextPageToken) {
                                nextToken = playlist.nextPageToken;
                                await getVideos(url, nextToken);
                                resolve(songs);
                            }
                            else {
                                resolve(songs);
                            }
                        }
                    })
                });
            }
            let songs = [];
            const url = args[0];
            songsInQ = await getVideos(url);
        }
        else if (args[0].startsWith("https://open.spotify.com/track/"))
        {
            var spotifyApi = new SpotifyWebApi({
                clientId: process.env.SPOT_CLIENT_ID,
                clientSecret: process.env.SPOT_CLIENT_SECRET,
                redirectUri: 'http://www.example.com/callback'
              });
              var login = Buffer.from(process.env.SPOT_CLIENT_ID +":"+process.env.SPOT_CLIENT_SECRET).toString('base64');
              spotifyApi.setAccessToken(await getSpotifyToken(login));
              var trackID = args[0].substring(args[0].indexOf("k/")+"k/".length);
              if(args[0].includes("?"))
              {
                trackID = args[0].substring(args[0].indexOf("k/")+"k/".length,args[0].indexOf("?"));
              }
            await spotifyApi.getTrack(trackID).then(async response => {
                artists = "";
                response.body.artists.forEach(artist => {
                    artists += artist.name + " ";
                })
                artists.substring(0, artists.lastIndexOf(" "));
                const video = await find_video(response.body.name, " - ", artists);
                if (video) {
                    song = {
                        title: video.title,
                        url: video.url,
                    };
                }
            })
        }
        else if (args[0].startsWith("https://open.spotify.com/album/"))
        {
            var spotifyApi = new SpotifyWebApi({
                clientId: process.env.SPOT_CLIENT_ID,
                clientSecret: process.env.SPOT_CLIENT_SECRET,
                redirectUri: 'http://www.example.com/callback'
              });
            var login = Buffer.from(process.env.SPOT_CLIENT_ID +":"+process.env.SPOT_CLIENT_SECRET).toString('base64');
            spotifyApi.setAccessToken(await getSpotifyToken(login));
            var albumID = args[0].substring(args[0].indexOf("album/")+"album/".length);
            if(args[0].includes("?"))
            {
                albumID = args[0].substring(args[0].indexOf("album/")+"album/".length,args[0].indexOf("?"));
            }
                 
            function getSongs(albumID) {
                return new Promise(resolve => {
                    spotifyApi.getAlbumTracks(albumID).then(async response => {
                        var index = 0;
                        let songs = []
                        response.body.items.forEach(async (item,i) => {
                            const song = await find_video(item.artists[0].name + "-" + item.name );
                            //Makes sure songs are in order, splice by index
                            if (song !== null) {
                                songs.splice(i, 0, song);
                            }
                            index++;
                            if (index === response.body.items.length) {
                                resolve(songs);
                            }
                        })                        
                    })
                })
            }
            songsInQ = await getSongs(albumID);
        }
        else if (args[0].startsWith("https://open.spotify.com/playlist/"))
        {
            var spotifyApi = new SpotifyWebApi({
                clientId: process.env.SPOT_CLIENT_ID,
                clientSecret: process.env.SPOT_CLIENT_SECRET,
                redirectUri: 'http://www.example.com/callback'
              });
              var login = Buffer.from(process.env.SPOT_CLIENT_ID +":"+process.env.SPOT_CLIENT_SECRET).toString('base64');
              spotifyApi.setAccessToken(await getSpotifyToken(login));
              var listID = args[0].substring(args[0].indexOf("t/")+"t/".length);
              if(args[0].includes("?"))
              {
                listID = args[0].substring(args[0].indexOf("t/")+"t/".length,args[0].indexOf("?"));
            }
            function fillSongs() {
                return new Promise(resolve => {
                    spotifyApi.getPlaylistTracks(listID).then(async response => {
                        let songs = new Array(response.body.items.length);
                        var i = 0;                   
                        response.body.items.forEach(async (item,index) => {
                            const song = await find_video(item.track.artists[0].name + "-" + item.track.name);
                            if (song !== null) {
                                songs.splice(index, 1, song);
                            }
                            else
                            {
                                songs.delete(index);
                            }
                            i++;
                            if (i === response.body.items.length)
                            {
                                resolve(songs)
                            }
                        })
                    })
                })             
            }
            songsInQ = await fillSongs();
        }
        else{
            const video = await find_video(args.join(' '));
            if (video) {
                song = {
                    title: video.title,
                    url: video.url,
                };
            }
            else {
                console.log("error");
                return message.channel.send("Could not find a video on: " + args.join(' '));
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
            if ("title" in song) {
                if (songsInQ.length > 0) {
                    songsInQ.forEach(song => {
                        queueConstructor.songs.push(song)
                    });
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`${songsInQ.length} songs have been added to the queue!`)
                    .setColor('#7508cf')
                    message.channel.send(embed);
                }
                else {
                    queueConstructor.songs.push(song);                    
                }                         
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
                if (songsInQ.length > 0) {
                    songsInQ.forEach(song => {
                        serverQueue.songs.push(song);
                    });                                           
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`${songsInQ.length} songs have been added to the queue!`)
                        .setColor('#7508cf')
                    return message.channel.send(embed);
                }
                else {
                    serverQueue.songs.push(song);
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`${song.title} has been added to the queue!`)
                        .setColor('#7508cf')
                    return message.channel.send(embed);
                }              
               
            }
            else {
                return;
            }
        }
    }    
}