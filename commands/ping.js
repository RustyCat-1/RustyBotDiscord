const Discord = require('discord.js')

module.exports = {
    command: function(recievedMessage) {
        const emBuilder = new Discord.EmbedBuilder()
        .setTitle('RustyBot Latency Test')
        .setDescription(`
Calculating latency...`)
        recievedMessage.channel.send( { embeds: [ emBuilder ] } )
        .then((msg) => {
            const emBuilder = new Discord.EmbedBuilder()
            .setTitle('RustyBot Latency Test')
            .setDescription(`
            Latency: \`${msg.createdTimestamp - recievedMessage.createdTimestamp}ms\`
            `)
            .setTimestamp()
            msg.edit({ "embeds": [ emBuilder ] })
        })
    }
}
