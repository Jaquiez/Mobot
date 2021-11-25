module.exports = {
    names: ["leave","stop"],
    description: 'makes the bot leave the channel',
    permissions: [],

    // Bans one member at a time.
    async execute(client, message, args, Discord, queue) {
        if(message.guild.me.voice.channel)
            message.guild.me.voice.channel.leave();
        else
            message.channel.send("bruh i'm not even in voice");
    }
}