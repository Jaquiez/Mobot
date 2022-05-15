module.exports = {
    names: ["loop"],
    description: 'loops current song.',
    permissions: [],
    async execute(client, message, args, Discord, queue) {
        const serverQueue = await queue.get(message.guild.id);
        if (serverQueue) {
            if(serverQueue.loop == true)
                serverQueue.loop = false
            else         
                serverQueue.loop = true                         
            const embed = new Discord.MessageEmbed()
                .setTitle(`Queue`)
                .setDescription(`Looping status: **${serverQueue.loop}**`)
                .setColor('#7508cf')
            message.channel.send(embed);
        }
        else {
            return message.channel.send("There are no songs in queue bruh.")
        }
    }
}