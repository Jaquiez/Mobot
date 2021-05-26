module.exports = {
    name: 'ud',
    description: 'gets urban dictionary definition of word',

    // Unbans a member from their user ID, can't unban from @ mention
    // Also, can't @ mention a member in chat after they have been unbanned because they aren't in the server anymore
    execute(message, args) {
        const fetch = require("node-fetch");
        const url = "https://www.urbandictionary.com/define.php?term=" + args[0];
        fetch(url).then(function (response) {
            // The API call was successful!
            return response.text();
        }).then(function (html) {
            // This is the HTML from our response as a text string
            const jsdom = require("jsdom");
            const dom = new jsdom.JSDOM(html)
            dom.serialize();
         
        }).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
        });

    }
}