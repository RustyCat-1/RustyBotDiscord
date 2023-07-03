
// import
const Discord = require('discord.js')
const { Client, GatewayIntentBits, MessageEmbed, ActivityType  } = require('discord.js');
require('dotenv/config')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('ready', () => {
    console.log('LOG || BOT READY')
    client.user.setStatus('available')
    client.user.setPresence({
        game: {
            name: 'r.help',
            type: "Playing"
            // url: "https://www.twitch.tv/monstercat"
        }
    });
})

client.on('messageCreate', message => {
    if (message.content.startsWith('r.')) {
        if (message.content === 'r.status') {
            message.reply('Bot is online')
        }
    }
})

client.login(process.env.TOKEN)