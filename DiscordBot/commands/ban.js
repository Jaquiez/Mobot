module.exports = {
    names: ["ban"],
    description: 'Bans a member',
    permissions: ["BAN_MEMBERS"],

    // Bans one member at a time.
    async execute(client, message, args) {
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