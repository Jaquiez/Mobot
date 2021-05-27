const queue = new Map();
module.exports = (Discord, client, message) => {
    const prefix = '.';
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd);
    const validPermissions = [
        "CREATE_INSTANT_INVITE",
        "KICK_MEMBERS",
        "BAN_MEMBERS",
        "ADMINISTRATOR",
        "MANAGE_CHANNELS",
        "MANAGE_GUILD",
        "ADD_REACTIONS",
        "VIEW_AUDIT_LOG",
        "PRIORITY_SPEAKER",
        "STREAM",
        "VIEW_CHANNEL",
        "SEND_MESSAGES",
        "SEND_TTS_MESSAGES",
        "MANAGE_MESSAGES",
        "EMBED_LINKS",
        "ATTACH_FILES",
        "READ_MESSAGE_HISTORY",
        "MENTION_EVERYONE",
        "USE_EXTERNAL_EMOJIS",
        "VIEW_GUILD_INSIGHTS",
        "CONNECT",
        "SPEAK",
        "MUTE_MEMBERS",
        "DEAFEN_MEMBERS",
        "MOVE_MEMBERS",
        "USE_VAD",
        "CHANGE_NICKNAME",
        "MANAGE_NICKNAMES",
        "MANAGE_ROLES",
        "MANAGE_WEBHOOKS",
        "MANAGE_EMOJIS",
    ]
    
    //loops throught the validPermissions list, checking if each perm of the command exists and if the user has the required perm

    try {
        if (command.permissions.length) {
            let invalidPerms = []
            for (const perm of command.permissions) {
                if (!validPermissions.includes(perm)) {
                    return console.log(`The ${perm} perm doesn't exist moron, check the command file`)
                }
                if (!message.member.hasPermission(perm)) {
                    invalidPerms.push(perm);
                    break;
                }
            }
            if (invalidPerms.length) {
                return message.channel.send(`You don't have the ${invalidPerms} perm moron`);
            }
        }

        //Creates two variables for music bot
        
        //const serverQueue = queue.get(message.guild.id);
        if (command) {
            command.execute(client, message, args, Discord,queue, queue);
        }
    } catch {
        message.channel.send('Not a real command bitch');
    }
    
   
    

    
}