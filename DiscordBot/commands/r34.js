const fetch = require("node-fetch");
const jsdom = require("jsdom");

module.exports = {
    names: ['r34','rule34'],
    description: 'Gives you a random r34 image of said thing',
    permissions: [],

    async execute(client, message, args, Discord) {
        const checkForReactions = (msg)=>
        {
            var emojis = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟']
            const filter = (reaction,user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id;
            for(var k=0;k<emojis.length;k++)
            {
                msg.react(emojis[k])
            }
            return msg.awaitReactions(filter, {max:1, time: 100000}).then(collected =>{                   
                const reaction = collected.first();
                for(var k=0;k<emojis.length;k++)
                {
                    if(reaction._emoji.name === emojis[k])
                    {
                        return k+1;
                    }
                }
                checkForReactions(msg);
            }).catch(err=>{
                console.error(err);
                return;
            })
        }
        if (!message.channel.nsfw) {
            return message.channel.send("This is only allowed in an NSFW channel");
        }
        var query = args.join(' ').replace(' ','_')
        let first = `https://rule34.paheal.net/api/internal/autocomplete?s=${query}`
        var r1 = await fetch(first)
        var queries = "";
        let counter = 1;
        let array = []
        for (var thing in await r1.json())
        {
            array.push(thing)
            queries = queries + `${counter}.) ${thing}\n`;
            counter++;
        }
        await message.channel.send(queries).then(async (msg)=>{
            let num = await checkForReactions(msg)
            console.log(num)
            if(num)
            {
                let url = "http://rule34.paheal.net/post/list/" + array[num] + "/1";
                var response = await fetch(url);
                var html = await response.text();
                const dom = new jsdom.JSDOM(html);
                var len = 1;
                //Finds how many pages there are for said topic
                dom.window.document.querySelectorAll('link').forEach((item) => {
                    if (item.rel === 'last') {
                        len = parseInt(item.href.substring(url.substring(0, url.length - 1).length));
                    }
                })
                //Picks a random page from the first to the last (for url page)
                url = "https://rule34.paheal.net/post/list/" + query + "/" + Math.floor(Math.random() * len)
                console.log(url);
                response = await fetch(url)
                html = await response.text();
                const imagedom = new jsdom.JSDOM(html);
                var arr = [];
                //Lookings for all the attributes in class name "shm-image-list" then iterating through the ones with an href link
                //then I find which href links are actual images and push them into the array
                imagedom.window.document.getElementsByClassName("shm-image-list").item(0).querySelectorAll("a").forEach(link => {
                    if (link.href.endsWith(".png") || link.href.endsWith(".jpg") || link.href.endsWith(".gif")) {
                        arr.push(link.href)
                    }
                });
                for(let k=0;k<10;k++)
                {
                    var image = arr[Math.floor(Math.random() * arr.length)];
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Rule 34: ' + query)
                        .setColor('#05ab08')
                        .setImage(image)
                    message.channel.send(embed);
                }
            }
            setTimeout(() => {
                msg.delete();
                return;
            }, 120000);
        })

    }
}