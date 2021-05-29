const fetch = require("node-fetch");
const jsdom = require("jsdom");

module.exports = {
    name: 'r34',
    description: 'Gives you a random r34 image of said thing',
    permissions: [],

    async execute(client, message, args, Discord) {
        var balls = "";
        for (var word of args) {
            balls += word;
        }
        const url = "https://rule34.paheal.net/post/list/" + balls + "/1";
        fetch(url).then(async function (response) {
            // The API call was successful!
            return response.text();
        }).then(async function (html) {
            // This is the HTML from our response as a text string    
            const dom = new jsdom.JSDOM(html);
            try {
                var arr = [];
                //Lookings for all the attributes in class name "shm-image-list" then iterating through the ones with an href link
                //then I find which href links are actual images and push them into the array
                dom.window.document.getElementsByClassName("shm-image-list").item(0).querySelectorAll("a").forEach(link => {
                    if (link.href.endsWith(".png") || link.href.endsWith(".jpg") || link.href.endsWith(".gif")) {
                        arr.push(link.href)
                    }                   
                });
                var url = arr[Math.floor(Math.random() * arr.length)];
                const embed = new Discord.MessageEmbed()
                    .setTitle('Rule 34: ' + balls)
                    .setColor('#05ab08')
                    .setImage(url)
                message.channel.send(embed);
            }
            catch (e) {
                console.log(e);
                return message.channel.send("This Rule 34 page doesn't exist...");
            }
        }).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
        });


    }
}