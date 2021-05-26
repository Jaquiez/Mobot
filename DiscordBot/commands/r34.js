var Scraper = require('images-scraper');
const fetch = require("node-fetch");
const jsdom = require("jsdom");

const google = new Scraper({
    puppeteer: {
        headless: true
    }

});

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
                dom.window.document.getElementsByClassName("shm-image-list").item(0).querySelectorAll("a").forEach(link => {
                    if (link.href.startsWith("https://peach.paheal.net/_images/")) {
                        arr.push(link.href)
                    }                   
                });
                var url = arr[Math.floor(Math.random() * arr.length)];
                const embed = new Discord.MessageEmbed()
                    .setTitle('Rule 34: ' + balls)
                    .setColor('#ff1122')
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