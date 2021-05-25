module.exports = {
    name: 'clear',
    description: 'clears number of messages that user specifies',


    execute(message, args) {
        try {
            const command = args.shift().toLowerCase();
            var numberOfMessagesToDelete = 1 + parseInt(command.substring(command.indexOf(' ')).trimEnd());
        }
        catch {
            var numberOfMessagesToDelete = 0;
        }
        //try to clear a valid number of messages
        //Discord API only allows messaged for deletion to be less than 2 weeks old
        try {
            if (numberOfMessagesToDelete > 1 && numberOfMessagesToDelete<99)
            {
                message.channel.bulkDelete(numberOfMessagesToDelete, true);
                message.channel.send('CLEARED ' + (numberOfMessagesToDelete - 1) + ' MESSAGE(S)!');
            }
            else
            {
                message.channel.send('Pick a number between 1 and 99 bruh');
            }
        }
        catch(error)
        {
            message.channel.send(error.toString());
            console.error(error);
        }       
    }
}