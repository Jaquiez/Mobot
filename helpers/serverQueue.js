const { joinVoiceChannel } = require("@discordjs/voice");
const Player = require("../helpers/Player.js");
class ServerQueue {
  constructor(voiceChannel, messageChannel) {
    this.songs = [];
    this.messageChannel = messageChannel;
    this.connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
    this.mobotPlayer = new Player(this);
    this.loop = false;
  }

  updateVoiceChannel(voiceChannel) {
    this.connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
  }
}
module.exports = ServerQueue;
