module.exports = {
    names: ['say'],
    description: 'Makes the bot say whatever follows the command, and deletes the call to the command from the chat',
    permissions: [],
        
    async execute(client, message, args) {
        var toSay = "";
        for(var word of args)
        {
            toSay += word + " ";
        }
        if (toSay) {
            message.channel.bulkDelete(1, true);
            message.channel.send(toSay);
        } else {
            message.channel.send('The fuck am I supposed to say dumbass');
        }   
    }
}