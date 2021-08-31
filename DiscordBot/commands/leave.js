module.exports = {
    names: ["leave","stop"],
    description: 'makes the bot leave the channel',
    permissions: [],

    // Bans one member at a time.
    async execute(client, message, args, Discord, queue) {
        const serverQueue = await queue.get(message.guild.id);
        serverQueue.voice_channel.leave();
    }
}