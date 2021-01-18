module.exports = {
    name: 'kick',
    description: 'Kicks a member',

    // Kicks one member at a time. 
    execute(message, args) {
        const target = message.mentions.users.first();

        if (target) {
            const memberTarget = message.guild.members.cache.get(target.id);
            memberTarget.kick();
            message.channel.send(`${memberTarget.user}` + ' has been kicked');
        }
        else {
            message.channel.send('Can\'t find that member');
        }
    }
}