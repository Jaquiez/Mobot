const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const play = require('../commands/play');
var SpotifyWebApi = require('spotify-web-api-node');
const yt_search = (query, message) => {
    return new Promise(async (resolve, reject) => {
        var response = await fetch(encodeURI("https://www.youtube.com/results?search_query=" + query) + "&sp=EgIQAQ%253D%253D");
        var html = await response.text();
        var parsedScript = JSON.parse(html.substring(html.indexOf("var ytInitialData = ") + "var ytInitialData = ".length, 1 + html.indexOf("};", html.indexOf("var ytInitialData ="))));
        for (let k = 0; k < parsedScript.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents.length; k++) {
            var item = parsedScript.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents[k];
            if (item.videoRenderer) {
                song = {
                    title: item.videoRenderer.title.runs[0].text,
                    url: "https://www.youtube.com/watch?v=" + item.videoRenderer.videoId,
                    length: item.videoRenderer.lengthText.simpleText,
                    requester: message.author
                }
                resolve(song);
                break;
            }
        }
        reject("Error occured when parsing the response for => " + query);
    }).catch((err) => {
        console.log(err);
    })
}
//Translates our query, whatever it is to a youtube link + metadata
async function linkify(args, message) {
    const songsToAdd = [];
    if (ytdl.validateURL(args)) {
        let songinfo = await ytdl.getInfo(args);
        const song = {
            title: songinfo.videoDetails.title,
            url: "https://www.youtube.com/watch?v=" + songinfo.videoDetails.videoId,
            length: songinfo.videoDetails.lengthSeconds,
            requester: message.author
        }
        songsToAdd.push(song);
    }
    else if (args.startsWith("https://www.youtube.com/playlist?list=") || args.startsWith("https://youtube.com/playlist?list=")) {
        const { google } = require('googleapis');
        function get_videos(playId, page) {
            return new Promise((resolve, reject) => {
                const data = google.youtube({
                    version: 'v3',
                    auth: process.env.GOOGLE_API
                })
                data.playlistItems.list({
                    part: ["contentDetails", "snippet"],
                    playlistId: playId,
                    maxResults: 45,
                    pageToken: page
                }).then(async playpart => {
                    playpart.data.items.forEach(item => {
                        song = {
                            title: item.snippet.title,
                            url: "https://www.youtube.com/watch?v=" + item.contentDetails.videoId,
                            length: '?',
                            requester: message.author
                        }
                        songsToAdd.push(song);
                    })
                    if(playpart.data.nextPageToken!=null)
                        await get_videos(playId,playpart.data.nextPageToken);
                    resolve(songsToAdd);
                })
            })

        }
        await get_videos(args.substring(args.indexOf('?list=') + '?list='.length));
    }
    else if(args.startsWith("https://open.spotify.com"))
    {
        if(args.contains('track')){

        }
        else if (args.contains('album'))
        {

        }
        else if(args.contains(''))
        {

        }
    }
    else {
        const song = await yt_search(args, message);
        songsToAdd.push(song);
    }
    message.channel.send(`Added ${songsToAdd.length} songs to the queue`);
    return songsToAdd;
}
module.exports = { linkify }