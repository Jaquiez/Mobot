// Require the necessary discord.js classes
const { Client, Intents } = require("discord.js");
const cmd_handler = require("./handlers/command_handler.js");
require("dotenv").config();

// Create a new client instance

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});
// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("MoBot is online!!!");
  cmd_handler.create();
});

client.on("messageCreate", function (message) {
  if (message.content.startsWith("-")) {
    cmd_handler.handle(message, client);
  }
});
// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
