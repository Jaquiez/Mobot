const {
  AudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const { MessageEmbed } = require("discord.js");
const play = require("play-dl");

class Player {
  constructor(serverQueue) {
    this.serverQueue = serverQueue;
    this.player = new AudioPlayer()
      .on(AudioPlayerStatus.Idle, () => {
        if(this.serverQueue.loop){this.serverQueue.songs.unshift(this.song);}
        this.playNextSong();
      })
      .on("error", (e) => {
        console.log(e);
        this.playNextSong();
      });
    this.song;
  }
  #createYTResource(song) {
    return new Promise(async (res, rej) => {
      let stream = await play.stream(song.url);
      let resource = createAudioResource(stream.stream, {
        inputType: stream.type,
      });
      return res(resource);
    });
  }
  async playNextSong() {
    if (this.serverQueue.songs.length > 0) {
      let song = this.serverQueue.songs.shift();
      this.song = song;
      if(song.media==="Spotify"){
        let songDetails = await song.getSong();
        song.url = songDetails.url;
        song.title = songDetails.title;
      }
      const embed = new MessageEmbed()
        .setTitle(`**Now playing ↓ | Loop status ${this.serverQueue.loop}**`)
        .setDescription(
          `[${song.title}](${song.url}) | Requested by ${song.requester}`
        );
      let msg = await this.serverQueue.messageChannel.send({ embeds: [embed] });
      //One time listener to delete the message
      this.player.once(AudioPlayerStatus.Idle,()=>{
        msg.delete()
      })
      let resource = await this.#createYTResource(song);
      this.player.play(resource);
      this.serverQueue.connection.subscribe(this.player);
    } else {
      this.player.stop();
      this.serverQueue.connection.destroy();
      require("../helpers/MasterQueue.js").removeEntry(
        this.serverQueue.messageChannel.guild.id
      );
    }
  }
}
module.exports = Player;