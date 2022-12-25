const SpotifyWebApi = require("spotify-web-api-node");
const YTHelper = require("../helpers/YTSongHelper.js")
let api = new SpotifyWebApi({
    clientId: process.env.SPOT_CLIENTID,
    clientSecret: process.env.SPOT_CLIENTSECRET,
});

async function getSpotToken(){
    let login = Buffer.from(process.env.SPOT_CLIENTID + ":" + process.env.SPOT_CLIENTSECRET).toString("base64");
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${login}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    return Promise.resolve((await response.json()).access_token);
}
async function getTrack(id){
    let token = await getSpotToken();
    api.setAccessToken(token);
    
    let resp = await api.getTrack(id);
    let song = {
        title: `${resp.body.artists[0].name} - ${resp.body.name}`,
        url: resp.body.external_urls.spotify,
        getSong: async () => await YTHelper.ytSearch(`${resp.body.artists[0].name} - ${resp.body.name}`)
    };
    return Promise.resolve([song]);
}

async function getAlbum(id){
    let token = await getSpotToken();
    api.setAccessToken(token);
    let resp = await api.getAlbumTracks(id);
    let songs = resp.body.items.map((item)=>
        ({
            title: `${item.artists[0].name} - ${item.name}`,
            url: item.external_urls.spotify,
            getSong: async () => await YTHelper.ytSearch(`${item.artists[0].name} - ${item.name}`)
        })
    )
    return songs;
}

async function getPlaylist(id){
    let token = await getSpotToken();
    api.setAccessToken(token);
    let details = await api.getPlaylist(id);
    let total = details.body.tracks.total;
    let arr = [];
    for(let i=0;i<total;i+=100){
        arr.push(i);
    }
    let songs = Promise.allSettled(arr.map(async i=>{
        let data = await api.getPlaylistTracks(id,{offset:i});
        return data.body.items.map(item=>
            ({
                title: `${item.track.artists[0].name} - ${item.track.name}`,
                url: item.track.external_urls.spotify,
                getSong: async () => await YTHelper.ytSearch(`${item.track.artists[0].name} - ${item.track.name}`)
            })
        );
    }))
    return (await songs).reduce((acc,e)=>
        acc.concat(e.value)
    ,[])
}

function handleSpotifyURL(url){
    let func;
    if(url.includes("track")){
        url = url.replace(/\/track\//,"");
        func = getTrack;
    }
    else if(url.includes("album")){
        url = url.replace(/\/album\//,"");
        func = getAlbum;
    }
    else if (url.includes("playlist")){
        url = url.replace(/\/playlist\//,"");
        func = getPlaylist;
    }
    else{
        return Promise.reject(`Could not parse ${url}`)
    }
    let id = url.replace(/\?.*$/,"");
    try{
        return Promise.resolve(func(id));
    }
    catch(e){
        console.log(e)
        return Promise.reject(`Error when looking up Spotify song`);
    }
}
module.exports = {handleSpotifyURL}