
module.exports = {
    name: 'skip',
    description: 'skips the song playing in the bot',
    permissions: [],

    //Nukes the channel but if you nuke it multiple times while the bot is online it will create multiple nuke messages
    async execute(client, message, args, Discord, queue) {
        const serverQueue = queue.get(message.guild.id);
        if (!message.member.voice.channel)
            return message.channel.send("You have to be in a voice channel to stop the music!");
        if (!serverQueue)
            return message.channel.send("There is no song that I could skip!");
        serverQueue.connection.dispatcher.end();
    }
}