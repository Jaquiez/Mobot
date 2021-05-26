module.exports = {
    name: 'unmute',
    description: 'unmutes a member',
    permissions: ["MUTE_MEMBERS"],

    // Unmutes a member by removing the "mute" role and giving them the "Infidel" role.
    async execute(client, message, args) {
        const target = message.mentions.users.first();
        if (target) {

            let muteRole = message.guild.roles.cache.find(role => role.name === 'mute');
            let mainRole = message.guild.roles.cache.find(role => role.name === 'Infidel');

            let memberTarget = message.guild.members.cache.get(target.id);


            memberTarget.roles.add(mainRole.id);
            memberTarget.roles.remove(muteRole.id);
            message.channel.send(`${memberTarget.user}` + ' has been unmuted. Don\'t fuck up.');
        } else {
            message.channel.send('Can\'t find that member');
        }
    }
}