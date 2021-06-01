module.exports = {
    name: 'clear',
    description: 'Clears the entire queue of songs',
    permissions: [],
    async execute(client, message, args, Discord, queue) {
        const serverQueue = await queue.get(message.guild.id);
        if (serverQueue) {
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
        }
        else {
            return message.channel.send("There are no songs in queue bruh.")
        }
    }
}