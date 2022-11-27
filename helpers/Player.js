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
        this.playNextSong();
      })
      .on("error", (e) => {
        console.log(e);
        this.playNextSong();
      });
    /*play.setToken({
            youtube: {
                cookie: `${process.env.YT_COOKIE}`
            }
        });*/
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
      const embed = new MessageEmbed()
        .setTitle(`**Now playing ↓ | Loop status ${this.serverQueue.loop}**`)
        .setDescription(
          `[${song.title}](${song.url}) | Requested by ${song.requester}`
        );
      this.serverQueue.messageChannel.send({ embeds: [embed] });
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
/*
async function playSong(serverQueue, guildId, message) {
    if (serverQueue.songs.length == 0) {
        queuehandler.masterQueue.delete(guildId);
        serverQueue.connection.destroy();
        return;
    }
    let song = serverQueue.songs[0];
    const embed = new MessageEmbed()
        .setTitle(`**Now playing ↓ | Loop status ${serverQueue.loop}**`)
        .setDescription(`[${song.title}](${song.url}) | Requested by ${song.requester}`);

    const msg = await message.channel.send({ embeds: [embed] });
    player = new AudioPlayer()
        .on(AudioPlayerStatus.Idle, () => {
            if (!serverQueue.loop)
                serverQueue.songs.shift();
            msg.delete();
            playSong(serverQueue, guildId, message);
        })
        .on('error', (e) => {
            serverQueue.songs.shift();
            embed.setTitle("An error has occurred");
            embed.setDescription(`${e}`);
            msg.edit({ embeds: [embed] });
            setTimeout(() => {
                msg.delete();
            }, 5000)
            playSong(serverQueue, guildId, message);
        })
    play.setToken({
        youtube: {
            cookie: `${process.env.YT_COOKIE}`
        }
    })

    serverQueue.player = player;
    serverQueue.connection.subscribe(player);
}
*/
