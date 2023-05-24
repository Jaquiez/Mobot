const YTHelper = require("../helpers/YTSongHelper.js");
const SpotHelper = require("../helpers/SpotifySongHelper.js")
const ytdl = require('ytdl-core');

//Translates our query, whatever it is to a youtube link + metadata
async function linkify(args, message) {
  let songsToAdd = [];
  let reSpot = /^https:\/\/open.spotify.com/;
  if(ytdl.validateURL(args)){
    let info = await ytdl.getInfo(args);
    songsToAdd.push({
      title: info.videoDetails.title,
      url: `https://www.youtube.com/watch?v=${info.videoDetails.videoId}`
    })
  }
  else if(/youtube.com\/playlist\?list=[a-zA-Z0-9_-]+/.test(args)){
    let listId = args.replace(/.*list=/,"").replace(/&.*/,"");
    songsToAdd = await YTHelper.get_playlist_videos(listId);
  }
  else if(reSpot.test(args)){
    let id = args.replace(reSpot,"");
    songsToAdd = (await SpotHelper.handleSpotifyURL(id)).map(item=>{
      item.media = "Spotify";
      return item
    });
  }
  else{
    let song = await YTHelper.ytSearch(args);
    songsToAdd.push(song);
  }
  return songsToAdd.map(item=>{
    item.requester = message.author;
    return item;
  })
}
module.exports = { linkify };
