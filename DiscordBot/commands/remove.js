
module.exports = {
    names: ['remove','r'],
    description: 'remove song at the index',
    permissions: [],

    //Nukes the channel but if you nuke it multiple times while the bot is online it will create multiple nuke messages
    async execute(client, message, args, Discord, queue) {
        const serverQueue = queue.get(message.guild.id);
        if (serverQueue) {
            if (serverQueue.songs[args[0] - 1]) {
                message.channel.send(`${serverQueue.songs[args[0] - 1]["title"]} has been removed`);
                serverQueue.songs.splice(args[0] - 1, 1);                
            }            
        }
    }
}