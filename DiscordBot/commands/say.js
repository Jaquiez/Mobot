module.exports = {
    name: 'say',
    description: 'makes the bot say whatever follows the command',
        
    execute(message, args) {
        const toSay = args.toString().substring(args.indexOf(' '))

        if (toSay) {
            message.channel.bulkDelete(1, true);
            message.channel.send(toSay);
        } else {
            message.channel.send('The fuck am I supposed to say dumbass');
        }   
    }
}