module.exports = {
    name: 'ud',
    description: 'gets urban dictionary definition of word',
    permissions: [],
    // Unbans a member from their user ID, can't unban from @ mention
    // Also, can't @ mention a member in chat after they have been unbanned because they aren't in the server anymore
    execute(message, args) {
        const fetch = require("node-fetch");
        const jsdom = require("jsdom");
        const url = "https://www.urbandictionary.com/define.php?term=" + args[0];
        fetch(url).then(function (response) {
            // The API call was successful!
            return response.text();
        }).then(function (html) {
            // This is the HTML from our response as a text string    
            const dom = new jsdom.JSDOM(html);        
            console.log(html); //Prints all of the content of the html to console
            var definition = dom.window.document.getElementsByClassName("meaning").item(1).textContent;
            console.log(definition);// prints this HTMLCollection {}
         
        }).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
        });
        

    }
}