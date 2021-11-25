/*
module.exports = {
    names: ['pause','unpause','resume'],
    description: 'remove song at the index',
    permissions: [],

    //Nukes the channel but if you nuke it multiple times while the bot is online it will create multiple nuke messages
    async execute(client, message, args, Discord, queue) {
        const serverQueue = queue.get(message.guild.id);
        if (serverQueue) {
            if(serverQueue.connection.player.dispatcher.pausedSince == null)
            {
                message.channel.send("Pausing your song.");
                await serverQueue.connection.player.dispatcher.pause();
            }
            else
            {
                message.channel.send("Resuming your song.");
                await serverQueue.connection.player.dispatcher.resume();
            }
        }
    }
}*/