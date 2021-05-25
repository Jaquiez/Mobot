module.exports = {
    name: 'mute',
    description: 'mutes a member',

    // Mutes a member by removing their "Infidel" role and replacing it with a "mute" role
    async execute(client, message, args) {
        const target = message.mentions.users.first();
        if (target) {

            let mainRole = message.guild.roles.cache.find(role => role.name === 'Infidel');
            let muteRole = message.guild.roles.cache.find(role => role.name === 'mute');

            let memberTarget = message.guild.members.cache.get(target.id);

            
            memberTarget.roles.add(muteRole.id);
            memberTarget.roles.remove(mainRole.id);
            message.channel.send(`${memberTarget.user}` + ' has been muted');
        } else {
            message.channel.send('Can\'t find that member');
        }
    }
}