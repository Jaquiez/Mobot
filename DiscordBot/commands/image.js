var Scraper = require('images-scraper');

const google = new Scraper({
    puppeteer: {
        headless: true
    }

});

module.exports = {
    name: 'image',
    description: 'Searches google for an image, and sends the first result. May take a few seconds after command is called.',
    permissions: [],

    async execute(client, message, args) {
        const image_query = args.join(' ');
        if (!image_query) return message.channel.send('Put an image name dumbass');

        const image_results = await google.scrape(image_query, 1);
        message.channel.send(image_results[0].url);
    }

}