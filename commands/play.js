const Discord = require("discord.js");
const masterQueue = require("../helpers/MasterQueue.js");
const songHandler = require("../handlers/songhandler.js");
async function execute(message, client) {
  let voiceChannel = message.member.voice.channel;
  if (!voiceChannel) {
    return require("../commands/join.js").execute(message, client);
  }
  if (!masterQueue.contains(voiceChannel.guild.id)) {
    require("../commands/join.js").execute(message, client);
  }
  let args = message.content.replace(/^.*? /,"");
  let serverQueue = masterQueue.getEntry(voiceChannel.guild.id);
  let songs = await songHandler.linkify(args, message);
  message.channel.send(`${songs.length} songs added to the Queue!`);
  serverQueue.songs = serverQueue.songs.concat(songs);
  if (serverQueue.mobotPlayer.player._state.status === "idle") {
    serverQueue.mobotPlayer.playNextSong();
  }
}

module.exports = {
  perms: [],
  desc: "Clones and destroys a channel",
  altnames: ['p'],
  execute,
};
