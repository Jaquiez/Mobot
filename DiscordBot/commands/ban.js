module.exports = {
    name: 'ban',
    description: 'Bans a member',

    // Bans one member at a time.
    execute(message, args) {
        const target = message.mentions.users.first();

        if (target) {
            const memberTarget = message.guild.members.cache.get(target.id);
            memberTarget.ban();
            message.channel.send(`${memberTarget.user}` + ' has been banned');
        }
        else {
            message.channel.send('Can\'t find that member');
        }
    }
}