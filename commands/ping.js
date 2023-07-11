const Discord = require('discord.js')

module.exports = {
    command: function(recievedMessage) {
        const emBuilder = new Discord.EmbedBuilder()
        .setTitle('RustyBot Latency Test')
        .setDescription(`
Calculating latency...`)
        recievedMessage.channel.send( { embeds: [ emBuilder ] } )
        .then((message) => {
            const emBuilder = new Discord.EmbedBuilder()
            .setTitle('RustyBot Latency Test')
            .setDescription(`
            Latency: \`${message.createdTimestamp - recievedMessage.createdTimestamp}ms\`
            `)
            .setTimestamp()
            message.edit({ "embeds": [ emBuilder ] })
        })
    }
}
