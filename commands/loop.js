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
  let serverQueue = masterQueue.getEntry(voiceChannel.guild.id);
  serverQueue.loop = !serverQueue.loop;
  message.channel.send(`Looping status changed to ${serverQueue.loop}`);
}

module.exports = {
  perms: [],
  desc: "Clones and destroys a channel",
  execute,
};
