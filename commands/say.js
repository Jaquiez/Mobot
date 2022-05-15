function execute(message,client) {
    let args = message.content.substring(message.content.indexOf(' '));
    message.delete()
        .then(msg=> msg.channel.send(args))
        .catch(console.error);
}

module.exports = {
    perms: [],
    desc: "Echoes [argument]",
    execute
}
