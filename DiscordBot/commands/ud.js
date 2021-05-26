var Scraper = require('images-scraper');
const fetch = require("node-fetch");
const jsdom = require("jsdom");

const google = new Scraper({
    puppeteer: {
        headless: true
    }

});

module.exports = {
    name: 'ud',
    description: 'gets urban dictionary definition of word',
    permissions: [],
    // Unbans a member from their user ID, can't unban from @ mention
    // Also, can't @ mention a member in chat after they have been unbanned because they aren't in the server anymore
    execute(client, message, args, Discord) {


        var balls = "";
        for (var word of args) {
            balls += word + " ";
        }
        const url = "https://www.urbandictionary.com/define.php?term=" + balls;
        console.log(url);
        fetch(url).then(function (response) {
            // The API call was successful!
            return response.text();
        }).then(function (html) {
            // This is the HTML from our response as a text string    
            const dom = new jsdom.JSDOM(html);
            try {
                var definition = dom.window.document.getElementsByClassName("meaning").item(0).textContent;
                var word = dom.window.document.getElementsByClassName("word").item(0).textContent;
                if (definition.length > 2000) {
                    definition = definition.substring(0, 2000);
                }
                const embed = new Discord.MessageEmbed()
                    .setTitle(word)
                    .setDescription(definition)
                    .setColor('#ff1122')
                message.channel.send(embed);
            }
            catch (e) {
                message.channel.send("This word ain't defined..");
            }
        }).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
        });
        

    }
}