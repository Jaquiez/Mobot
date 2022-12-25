const YTHelper = require("../helpers/YTSongHelper.js");
const SpotHelper = require("../helpers/SpotifySongHelper.js")
const{ yt_validate,video_info}= require('play-dl');
//Translates our query, whatever it is to a youtube link + metadata
async function linkify(args, message) {
  let songsToAdd = [];
  let reSpot = /^https:\/\/open.spotify.com/;
  if(yt_validate(args) === 'video'){
    let info = await video_info(args);
    songsToAdd.push({
      title: info.video_details.title,
      url: info.video_details.url
    })
  }
  else if(yt_validate(args)==='playlist'){
    let listId = args.replace(/.*list=/,"").replace(/&.*/,"");
    console.log(listId);
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
