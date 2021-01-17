module.exports = {
    name: 'clear',
    description: 'clears number of messages that user specifies',


    execute(message, args) {
        const command = args.shift().toLowerCase();        
        const numberOfMessagesToDelete = 1 + parseInt(command.substring(command.indexOf(' ')).trimEnd());
        //try to clear a valid number of messages
        //Discord API only allows messaged for deletion to be less than 2 weeks old
        //Find a work around later
        //Also check for user roles to ensure only valid users can use this command
        try {
            if (numberOfMessagesToDelete > 0 && numberOfMessagesToDelete < 99)
            {
                message.channel.bulkDelete(numberOfMessagesToDelete, true);
                message.channel.send('CLEARED ' + (numberOfMessagesToDelete - 1) + ' MESSAGE(S)!');
            }
            else
            {
                message.channel.send('INVALID NUMBER!');
            }
        }
        catch
        {
            message.channel.send('NOT A VALID NUMBER >:(');
        }       
    }
}