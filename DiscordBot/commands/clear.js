module.exports = {
    name: 'clear',
    description: 'clears number of messages that user specifies',


    execute(message, args) {
        const command = args.shift().toLowerCase();        
        const numberOfMessagesToDelete = 1 + parseInt(command.substring(command.indexOf(' ')).trimEnd());
        //try to clear a valid number of messages
        //Discord API only allows messaged for deletion to be less than 2 weeks old
        try {
            if (numberOfMessagesToDelete > 1 && numberOfMessagesToDelete<99)
            {
                message.channel.bulkDelete(numberOfMessagesToDelete, true);
                message.channel.send('CLEARED ' + (numberOfMessagesToDelete - 1) + ' MESSAGE(S)!');
            }
            else if (numberOfMessagesToDelete > 99)
            {
                message.channel.send('I can only remove 99 messages at a time!');
            }
            else
            {               
                message.channel.send('That isn\'t a valid number');
            }
        }
        catch(error)
        {
            message.channel.send('ERROR');
            console.error(error);
        }       
    }
}