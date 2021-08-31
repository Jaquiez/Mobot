module.exports = {
    names: ['unmute'],
    description: 'Unmutes a member [NOT WORKING]',
    permissions: ["MUTE_MEMBERS"],

    // Unmutes a member by removing the "mute" role
    async execute(client, message, args) {
        const target = message.mentions.users.first();
        if (target) {

            //let muteRole = message.guild.roles.cache.find(role => role.name === 'mute');
            //let mainRole = message.guild.roles.cache.find(role => role.name === 'Infidel');

            let memberTarget = message.guild.members.cache.get(target.id);


            //memberTarget.roles.add(mainRole.id);
            //memberTarget.roles.remove(muteRole.id);
            //message.channel.send(`${memberTarget.user}` + ' has been unmuted. Don\'t fuck up.');
            message.channel.send('Not working right now');
        } else {
            message.channel.send('Can\'t find that member');
        }
    }
}