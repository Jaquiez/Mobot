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
  for(let i=0;i<serverQueue.songs.length;++i){
    let j = Math.floor(Math.random()*i);
    let temp = serverQueue.songs[i];
    serverQueue.songs[i] = serverQueue.songs[j];
    serverQueue.songs[j] = temp;
  }
  message.channel.send("Successfully shuffle the tracks!");
}

module.exports = {
  perms: [],
  desc: "Clones and destroys a channel",
  execute,
};
