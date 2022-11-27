const { MessageEmbed } = require("discord.js");
async function execute(message, client) {
  let cmds = require("../handlers/command_handler.js").commands;
  let help = Object.entries(cmds).reduce(
    (acc, [k, v]) => acc + `**${k}**: ${v.desc} \n`,
    ""
  );
  const embed = new MessageEmbed().setTitle("Commands").setDescription(help);
  message.channel.send({ embeds: [embed] });
}

module.exports = {
  perms: [],
  desc: "bruh :|",
  execute,
};
