const ytdl = require('ytdl-core');
const { execute } = require('./clean');
const ytSearch = require('yt-search');
const message = require('../events/guild/message');
const fetch = require("node-fetch");
const jsdom = require("jsdom");
const { indexOf } = require('ffmpeg-static');
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
            let songs = [];
            const url = args[0];
            //This can be an async or normal function it doesn't matter from what I can tell
            async function checkYTURL(url) {
                //This part matters, you must return a promise
                //This promise means it will not return until something is resolved 
                return new Promise(resolve => {      
                //Get information AND THEN send the response to the next function          
                fetch(url).then(async function (response) {
                    // Use the response from the API Call to get the text
                    return response.text();
                }).then(async function (html) {
                    // HTML is the text from the response  
                    //parse the HTML doc using JSDOM 
                    const dom = new jsdom.JSDOM(html);  
                    //Find all the scripts in the doc and iterate through them         
                    dom.window.document.querySelectorAll("script").forEach(thing => {
                        var script = thing.innerHTML;
                        //The script with all the playlist data has this var
                        if (script.indexOf("var ytInitialData =") > -1) {
                            //Take only the data within brackets of the var {all the bs inside}
                            //This puts it in JSON notation
                            var playlistScript = script.substring(script.indexOf("var ytInitialData = ") + "var ytInitialData = ".length, script.indexOf(";", script.indexOf("var ytInitialData =")))
                            //parse the string in JSON notation and now we have our data (after all that bs)
                            var parsedScript = JSON.parse(playlistScript)
                            //This data has a bunch of bs we don't need so we sift the all the bs 
                            //You can log the parsedScript in the console to see the possible contents then log the contents and so on
                            //now iterate through that shit
                            parsedScript.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].playlistVideoListRenderer.contents.forEach(object => {
                                //Finally we get the song title and url after going through EVEN more contents of this giant data structure
                                //put yt.com in front of url (because it is shortened) and you have your song
                                if (object.playlistVideoRenderer) {
                                    var songTitle = object.playlistVideoRenderer.title.runs[0].text
                                    var urlFrag = object.playlistVideoRenderer.navigationEndpoint.commandMetadata.webCommandMetadata.url;
                                    var url = "https://www.youtube.com" + urlFrag.substring(0, urlFrag.indexOf("&list="));
                                    //Put it in the song kv pair object
                                    song = {
                                        title: songTitle,
                                        url: url,
                                    };
                                    //put that in the songs array and keep iterating
                                    songs.push(song)
                                }
                            });      
                            //Resolve songs here because this basically says THIS is the promise we wanna return :)   
                            //console.log(songs);
                            resolve(songs);
                        }
                    });
                }).catch(function (err) {
                    // There was an error
                    console.warn('Something went wrong.', err);
                    return [];
                });
                })
            }
            //DO NOT CONTINUE DOING ANYTHING until checkYTURL is done (await for return)
            songsInQ = await checkYTURL(url);
        }
        else{
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
                console.log(serverQueue)
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
                    for (pong in songsInQ) {
                        songsInQ.forEach(song => {
                            serverQueue.songs.push(song);
                            console.log(song)
                        });                       
                    }
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`${songsInQ.length} songs have been added to the queue!`)
                        .setColor('#7508cf')
                    return message.channel.send(embed);
                }
                else {
                    serverQueue.songs.push(song);
                    console.log(serverQueue.songs);
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