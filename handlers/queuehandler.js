let masterQueue = new Map();

function constructServerQueue(connection){
    let serverQueue ={
        songs:[],
        connection:connection,
        player:null
    };
    masterQueue.set(connection.joinConfig.guildId,serverQueue);
}
module.exports = {masterQueue,constructServerQueue}