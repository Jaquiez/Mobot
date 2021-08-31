
const googleTTS = require('google-tts-api');
const ffmpeg = require('ffmpeg');
module.exports = {
    names: ['tts'],
    description: 'speaks the words said in the voice chat the user is connected to [IN DEVELOPMENT]',
    permissions: [],

    //Nukes the channel but if you nuke it multiple times while the bot is online it will create multiple nuke messages
    async execute(client, message, args, Discord, queue) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
            return message.channel.send(
                "You need to be in a voice channel to play music!"
            );
        const url = googleTTS.getAllAudioUrls(args.join(' '), {
            lang: 'en',
            slow: false,
            host: 'https://translate.google.com',
        });
        let stream = url;
        console.log(stream);
        
    }
}