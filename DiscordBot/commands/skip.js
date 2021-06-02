
module.exports = {
    name: 'skip',
    description: 'skips the song playing in the bot',
    permissions: [],

    async execute(client, message, args, Discord, queue) {
        const serverQueue = queue.get(message.guild.id);
        if (!message.member.voice.channel)
            return message.channel.send("You have to be in a voice channel to stop the music!");
        if (!serverQueue)
            return message.channel.send("There is no song that I could skip!");
        if (serverQueue.connection.dispatcher  !== null) {
            serverQueue.connection.dispatcher.end();
        }
        else {
            message.channel.send("You disconnected me from the channel, so I deleted your queue. Please just use \".clear\" to disconnect me.")
            queue.delete(message.guild.id);
        }
    }
}