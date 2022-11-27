const masterQueue = require("../helpers/MasterQueue.js");

async function execute(message, client) {
  let voiceChannel = message.member.voice.channel;
  if (!voiceChannel) {
    message.reply("You're not in a voice channel!");
    return;
  }
  if (masterQueue.contains(voiceChannel.guild.id)) {
    let q = masterQueue.getEntry(voiceChannel.guild.id);
    q.songs = [];
    q.mobotPlayer.player.stop();
  }
}

module.exports = {
  perms: [],
  desc: "Joins a voice channel",
  execute,
};
