const { MessageEmbed, Message } = require("discord.js");
const masterQueue = require("../helpers/MasterQueue.js");
const songHandler = require("../handlers/songhandler.js");

function getQString(q,i){
    let qString = ``;
    let counter = 0;
    while(counter<10){
        let song = q[i++];
        if(song==undefined){break;}
        ++counter;
        qString += `${i}.) [${song.title}](${song.url}) | Requested by ${song.requester}\n`
    }
    return qString;
}
async function execute(message, client) {
    let voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.reply("You're not in a voice channel!");
      return;
    }
    if (masterQueue.contains(voiceChannel.guild.id)) {
      let q = masterQueue.getEntry(voiceChannel.guild.id);
      let i = 0;
      let qString = getQString(q.songs,i);
      const embed = new MessageEmbed()
        .setTitle(`**Queue**`)
        .setDescription(
            qString
        );
      let msg = await message.channel.send({embeds:[embed]});
      setTimeout(()=>{
        msg.delete();
      },60000)
      const filter = (reaction, user) =>  
        ['⬅️', '➡️'].includes(reaction._emoji.name) && user && user.id === message.author.id;
      reactHelper();
      function reactHelper(){
        try{
          msg.react('⬅️');
          msg.react('➡️');
          msg.awaitReactions({filter,max:1,time:180_000})
          .then(collected=>{
            let react = collected.first();
            i = react._emoji.name==='⬅️' ? i -10 : i+10;
            i = i < 0 ? 0 : i;
            i = i >= q.songs.length ? q.songs.length - 10 : i;
            embed.setDescription(getQString(q.songs,i));
            msg.edit({embeds:[embed]})
            msg.reactions.removeAll();
            reactHelper();
          })
          .catch(console.error)
        }
        catch(e){
          console.log(e)
        }
      }
    }
    else{
      message.reply("There is no queue!");
    }
}

module.exports = {
  perms: [],
  desc: "Shows the queue of songs.",
  altnames:['q'],
  execute,
};
