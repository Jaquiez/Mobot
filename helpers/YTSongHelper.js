const { google } = require("googleapis");

function getVideos(data){
    return data.items.map(item=>({
        title:item.snippet.title,
        url:`https://youtube.com/watch?v=${item.contentDetails.videoId}`
    }))
}
async function get_playlist_videos(playId){
    const data = google.youtube({
        version: "v3",
        auth: process.env.GOOGLE_API,
    });
    let resp = await data.playlistItems.list({
        part: ["contentDetails","snippet"],
        playlistId: playId,
        maxResults:50,
    })
    let songs = getVideos(resp.data);
    while(resp.data.nextPageToken!=null){
        resp = await data.playlistItems.list({
            part: ["contentDetails","snippet"],
            playlistId: playId,
            maxResults:50,
            pageToken: resp.data.nextPageToken
        })
        songs = songs.concat(getVideos(resp.data))
    }    
    return Promise.resolve(songs);
}
async function ytSearch(query){
    try{
        let resp = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
        let body = await resp.text();
        let jsonString = body.substring(16+body.indexOf("ytInitialData"));
        jsonString = jsonString.substring(0,jsonString.indexOf("};")+1)
        let json = JSON.parse(jsonString);
        let items = json.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents;
        for(let i=0;i<items.length;++i){
            if("videoRenderer" in items[i]){
                let song = items[i].videoRenderer;
                return {
                    title:song.title.runs[0].text,
                    url:`https://youtube.com/watch?v=${song.videoId}`
                }
            }
        }
        throw new Error(`No videos in item response.`)
    }
    catch(e){
        console.log(e)
        return Promise.reject(`Failed when searching Youtube for ${query}`)
    }

}


module.exports = {ytSearch,get_playlist_videos}