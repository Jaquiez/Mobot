const fetch = require("node-fetch");
const jsdom = require("jsdom");

module.exports = {
    name: 'r34',
    description: 'Gives you a random r34 image of said thing',
    permissions: [],

    async execute(client, message, args, Discord) {
        if (!message.channel.nsfw) {
            return message.channel.send("This is only allowed in an NSFW channel");
        }

        var query = args.join(' ')
        let url = "http://rule34.paheal.net/post/list/" + query + "/1";
        var response = await fetch(url)
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
        var image = arr[Math.floor(Math.random() * arr.length)];
        const embed = new Discord.MessageEmbed()
            .setTitle('Rule 34: ' + query)
            .setColor('#05ab08')
            .setImage(image)
        message.channel.send(embed);

    }
}