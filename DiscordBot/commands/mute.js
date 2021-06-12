module.exports = {
    name: 'mute',
    description: 'Mutes a member',
    permissions: ["MUTE_MEMBERS"],

    // Mutes a member by removing their 
    async execute(client, message, args) {
        const target = message.mentions.users.first();
        if (target) {

            //let mainRole =
            
            //let muteRole = 
            //let muteRole = message.guild.roles.cache.find(role => guild.roles.permissions.cache.find("SEND_MESSAGES") !== true);
            let memberTarget = message.guild.members.cache.get(target.id);            
            //memberTarget.roles.add(muteRole.id);
            //memberTarget.roles.remove(mainRole.id);
            //message.channel.send(`${memberTarget.user}` + ' has been muted');
            message.channel.send("Not working right now");
        } else {
            message.channel.send('Can\'t find that member');
        }
    }
}