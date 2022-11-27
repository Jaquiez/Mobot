const jsdom = require("jsdom");
const fetch = require("node-fetch");
const Discord = require("discord.js");

async function execute(message, client) {
  let args = message.content.substring(message.content.indexOf(" ") + 1);
  let definition;
  try {
    let resp = await fetch(
      `https://www.urbandictionary.com/define.php?term=${encodeURI(args)}`
    );
    let html = await resp.text();
    let dom = new jsdom.JSDOM(html);
    definition = await dom.window.document
      .getElementsByClassName("meaning mb-4")
      .item(0)
      .textContent.substring(0, 2000);
  } catch (e) {
    message.channel.send(`No definition for: ${args}`);
    console.error(e);
    return;
  }
  let embed = await new Discord.MessageEmbed()
    .setTitle(`${args}`)
    .setDescription(definition)
    .setImage("https://miro.medium.com/max/4000/1*ctUugc4pAxlLweBOxzySLg.png");
  message.channel.send({ embeds: [embed] });
}
/*
 */
module.exports = {
  perms: [],
  desc: "Gives a very accurate definition of [argument]",
  execute,
};
