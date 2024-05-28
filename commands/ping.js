const Discord = require('discord.js')

module.exports = {
    execute: function(recievedMessage, clientPing) {
        const emBuilder = new Discord.EmbedBuilder()
        .setTitle('RustyBot Latency Test')
        .setDescription(`
Calculating latency...`)
        recievedMessage.channel.send({ embeds: [ emBuilder ] })
        .then((message) => {
            const emBuilder = new Discord.EmbedBuilder()
            .setTitle('RustyBot Latency Test')
            .setDescription(`
            Latency: \`${message.createdTimestamp - recievedMessage.createdTimestamp}ms\`
            Average API Latency: \`${clientPing}ms\`
            `)
            .setTimestamp();
            message.edit({ "embeds": [ emBuilder ] });
        })
    }
}
