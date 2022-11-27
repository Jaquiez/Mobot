const Discord = require("discord.js");
async function execute(message, client) {
  await message.channel.clone().then((clone) => {
    const embed = new Discord.MessageEmbed()
      .setTitle("Channel has been nuked")
      .setDescription("Goodbye to all your old messages ;(")
      .setColor("#ff1122")
      .setImage(
        "https://media1.tenor.com/images/f4ae445388be803fa8a69870962f98cc/tenor.gif"
      );
    clone.send({ embeds: [embed] });
  });
  message.channel.delete();
}

module.exports = {
  perms: [
    Discord.Permissions.FLAGS.MANAGE_MESSAGES,
    Discord.Permissions.FLAGS.MANAGE_CHANNELS,
  ],
  desc: "Clones and destroys a channel",
  execute,
};
