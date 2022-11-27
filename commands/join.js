const Discord = require("discord.js");
const ServerQueue = require("../helpers/serverQueue.js");
const masterQueue = require("../helpers/MasterQueue.js");

require("../helpers/serverQueue.js");
async function execute(message, client) {
  let voiceChannel = message.member.voice.channel;
  if (!voiceChannel) {
    message.reply("You're not in a voice channel!");
    return;
  }
  if (masterQueue.contains(voiceChannel.guild.id)) {
    masterQueue
      .getEntry(voiceChannel.guild.id)
      .updateVoiceChannel(voiceChannel);
    return;
  }
  let serverQueue = new ServerQueue(voiceChannel, message.channel);
  masterQueue.setEntry(voiceChannel.guild.id, serverQueue);
}

module.exports = {
  perms: [],
  desc: "Joins a voice channel",
  execute,
};
