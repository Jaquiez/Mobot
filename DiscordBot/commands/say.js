module.exports = {
    name: 'say',
    description: 'makes the bot say whatever follows the command',
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