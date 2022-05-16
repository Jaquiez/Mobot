const fs = require('fs');
let commands = [];

function checkPerms(cmd, message) {
    let perms = require(`../commands/${cmd}.js`).perms;
    for (let s = 0; s < perms.length; s++) {
        if (!message.member.permissions.has(perms[s]))
            return false;
    }
    return true;
}
function create() {
    fs.readdirSync('commands').forEach(item => {
        commands.push({
            "name":item.replace('.js', ''),
            "desc":require(`../commands/${item}`).desc,
            "altnames":require(`../commands/${item}`).altnames
        });
    })
}

function handle(message, client) {
    let cmd = message.content.split(' ')[0].replace('-', '').toLowerCase();
    commands.forEach((command) => {
        if (cmd === command.name) {
            if (!checkPerms(cmd, message)) {
                message.reply("Invalid perms!");
                return;
            }
            else {
                require(`../commands/${cmd}.js`).execute(message, client);
            }
        }
        if(command.altnames){
            command.altnames.forEach(name=>{
                if(name===cmd){
                    require(`../commands/${command.name}.js`).execute(message, client);
                }
            })
        }
    })
}

module.exports = { handle, create,commands }