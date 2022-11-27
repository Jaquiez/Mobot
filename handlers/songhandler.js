const fetch = require("node-fetch");
var SpotifyWebApi = require("spotify-web-api-node");
const play = require("play-dl");
const yt_search = (query, message, retry) => {
  return new Promise(async (resolve, reject) => {
    //console.log(encodeURI("https://www.youtube.com/results?search_query=" + query) + "&sp=EgIQAQ%253D%253D");
    var response = await fetch(
      encodeURI("https://www.youtube.com/results?search_query=" + query) +
        "&sp=EgIQAQ%253D%253D"
    );
    var html = await response.text();
    var parsedScript = JSON.parse(
      html.substring(
        html.indexOf("var ytInitialData = ") + "var ytInitialData = ".length,
        1 + html.indexOf("};", html.indexOf("var ytInitialData ="))
      )
    );
    for (
      let k = 0;
      k <
      parsedScript.contents.twoColumnSearchResultsRenderer.primaryContents
        .sectionListRenderer.contents[0].itemSectionRenderer.contents.length;
      k++
    ) {
      var item =
        parsedScript.contents.twoColumnSearchResultsRenderer.primaryContents
          .sectionListRenderer.contents[0].itemSectionRenderer.contents[k];
      if (item.videoRenderer) {
        song = {
          title: item.videoRenderer.title.runs[0].text,
          url: "https://www.youtube.com/watch?v=" + item.videoRenderer.videoId,
          length: item.videoRenderer.lengthText.simpleText,
          requester: message.author,
        };
        return resolve(song);
      }
    }
    console.log(retry);
    if (retry < 1)
      reject("Error occured when parsing the response for => " + query);
    else resolve(await yt_search(query, message, retry - 1));
  }).catch((err) => {
    console.log(err);
  });
};
//Translates our query, whatever it is to a youtube link + metadata
async function linkify(args, message) {
  let songsToAdd = [];
  /*
    if (play.yt_validate(args)==='video') {
        
        let songinfo = await play.search(args, {
            limit: 1
        })
        console.log(songinfo)
        const song = {
            title: songinfo.videoDetails.title,
            url: "https://www.youtube.com/watch?v=" + songinfo.videoDetails.videoId,
            length: songinfo.videoDetails.lengthSeconds,
            requester: message.author
        }
        songsToAdd.push(song);
    }
    else */ if (
    args.startsWith("https://www.youtube.com/playlist?list=") ||
    args.startsWith("https://youtube.com/playlist?list=")
  ) {
    const { google } = require("googleapis");
    function get_videos(playId, page) {
      return new Promise((resolve, reject) => {
        const data = google.youtube({
          version: "v3",
          auth: process.env.GOOGLE_API,
        });
        data.playlistItems
          .list({
            part: ["contentDetails", "snippet"],
            playlistId: playId,
            maxResults: 45,
            pageToken: page,
          })
          .then(async (playpart) => {
            playpart.data.items.forEach((item) => {
              song = {
                title: item.snippet.title,
                url:
                  "https://www.youtube.com/watch?v=" +
                  item.contentDetails.videoId,
                length: "?",
                requester: message.author,
              };
              songsToAdd.push(song);
            });
            if (playpart.data.nextPageToken != null)
              await get_videos(playId, playpart.data.nextPageToken);
            resolve(songsToAdd);
          });
      });
    }
    await get_videos(args.substring(args.indexOf("?list=") + "?list=".length));
  } else if (args.startsWith("https://open.spotify.com")) {
    let spotifyapi = new SpotifyWebApi({
      clientId: process.env.SPOT_CLIENTID,
      clientSecret: process.env.SPOT_CLIENTSECRET,
    });

    let login = Buffer.from(
      process.env.SPOT_CLIENTID + ":" + process.env.SPOT_CLIENTSECRET
    ).toString("base64");
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${login}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    let key = await response.json();
    spotifyapi.setAccessToken(key.access_token);

    let trackEnd = args.indexOf("?") > 0 ? args.indexOf("?") : args.length;
    await new Promise(async (resolve, reject) => {
      if (args.includes("track")) {
        let trackId = args.substring(
          args.indexOf("track") + "track/".length,
          trackEnd
        );
        await new Promise(async (resolve) => {
          spotifyapi
            .getTrack(trackId)
            .then(async (track) => {
              let artists = "";
              track.body.artists.forEach((artist) => {
                artists = artists + `${artist.name}`;
              });
              let song = await yt_search(
                `${track.body.name} - ${artists}`,
                message,
                3
              );
              resolve(songsToAdd.push(song));
            })
            .catch((error) => {
              reject(error);
            });
        });
      } else if (args.includes("album")) {
        let albumId = args.substring(
          args.indexOf("album") + "album/".length,
          trackEnd
        );
        let info = await spotifyapi.getAlbum(albumId);
        songsToAdd = new Array(info.body.total);
        await Promise.all(
          info.body.tracks.items.map(async (track, index) => {
            let artists = "";
            track.artists.forEach((artist) => {
              artists = artists + ` ${artist.name}`;
            });
            let song = await yt_search(
              `${track.name} - ${artists}`,
              message,
              3
            );
            if (song) songsToAdd[index] = song;
            else songsToAdd.splice(index, 1);

            console.log(`${index} and ${song.title}`);
          })
        );
      } else if (args.includes("playlist")) {
        let playId = args.substring(
          args.indexOf("playlist") + "playlist/".length,
          trackEnd
        );
        function getTracks(id, offset) {
          return new Promise(async (resolve, reject) => {
            let info = await spotifyapi.getPlaylistTracks(id, {
              limit: 100,
              offset: offset,
            });
            let songs = new Array(info.body.items.length);
            if (info.body.offset >= info.body.total) return resolve(songs);
            await Promise.all(
              info.body.items.map(async (trackInfo, index) => {
                let artists = "";
                trackInfo.track.artists.forEach((artist) => {
                  artists = artists + ` ${artist.name}`;
                });
                let song = await yt_search(
                  `${trackInfo.track.name} - ${artists}`,
                  message,
                  3
                );
                if (song) songs[index] = song;
              })
            );
            offset = offset + info.body.limit;
            let val = await getTracks(id, offset);
            songs.push.apply(songs, val);
            resolve(songs);
          });
        }
        songsToAdd = await getTracks(playId, 0);
      }

      resolve(songsToAdd);
    });
  } else {
    const song = await yt_search(args, message, 3);
    if (!song) {
      message.channel.send(`Couldn't find ${args}`);
      return [];
    }
    songsToAdd.push(song);
  }
  songsToAdd = songsToAdd.filter(Boolean);
  message.channel.send(`Added ${songsToAdd.length} songs to the queue`);
  return songsToAdd;
}
module.exports = { linkify };
