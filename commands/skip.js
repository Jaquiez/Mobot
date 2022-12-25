const Discord = require("discord.js");
const masterQueue = require("../helpers/MasterQueue.js");
function execute(message, client) {
  let voiceChannel = message.member.voice.channel;
  if (!voiceChannel) {
    message.reply("You're not in a voice channel!");
    return;
  }
  let guildId = voiceChannel.guild.id;
  if (!masterQueue.contains(guildId)) {
    message.reply("I'm not in a voice channel! Use -join to get me in one!");
    return;
  }
  let serverQueue = masterQueue.getEntry(guildId);
  serverQueue.mobotPlayer.player._events.idle.forEach(f=>f())
}

module.exports = {
  perms: [],
  desc: "Clones and destroys a channel",
  execute,
};
