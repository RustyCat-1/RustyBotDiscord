const Discord = require('discord.js')

module.exports = {
    command: function(recievedMessage, ping) {
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
            API Latency: \`${ping}ms\`
            `)
            .setTimestamp()
            message.edit({ "embeds": [ emBuilder ] })
        })
    }
}
