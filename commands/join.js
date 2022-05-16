const {joinVoiceChannel, entersState, VoiceConnectionStatus} = require('@discordjs/voice');
async function execute(message,client) {
    let voiceChannel = message.member.voice.channel;
    if(!voiceChannel)
    {
        message.reply("You're not in a voice channel");
        return -1;
    }
	const connection = joinVoiceChannel({
		channelId: voiceChannel.id,
		guildId: voiceChannel.guildId,
		adapterCreator: voiceChannel.guild.voiceAdapterCreator
	});
    await entersState(connection,VoiceConnectionStatus.Ready);
    require('../handlers/queuehandler.js').constructServerQueue(connection);
    return 0;

}

module.exports = {
    altnames: ['j'],
    perms: [],
    desc: "MoBot will join the voice channel",
    execute
}
