const fs = require("fs");
let commands = {};

function checkPerms(cmd, message) {
  return require(`../commands/${cmd}.js`).perms.every((perm) =>
    message.member.permissions.has(perm)
  );
}
function create() {
  fs.readdirSync("commands").forEach((item) => {
    commands[item.replace(".js", "")] = {
      desc: require(`../commands/${item}`).desc,
      altnames: require(`../commands/${item}`).altnames,
    };
  });
}

function handle(message, client) {
  let cmd = message.content.split(" ")[0].replace("-", "").toLowerCase();
  if (cmd in commands) {
    if (checkPerms(cmd, message)) {
      require(`../commands/${cmd}.js`).execute(message, client);
    } else {
      message.reply("Invalid perms!");
    }
    return;
  } 
  Object.keys(commands).some((key)=>{
    cmd2 = commands[key];
    if(cmd2.altnames!=undefined && cmd2.altnames.some(cmdName => cmd===cmdName)){
      if(checkPerms(key,message)){
        require(`../commands/${key}.js`).execute(message, client);
      }else{
        message.reply("Invalid perms!");
      }
      return true;
    }
  })
}

module.exports = { handle, create, commands };
