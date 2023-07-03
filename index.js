
// import

function commandStatus(){

}

const Discord = require('discord.js')
const { Client, GatewayIntentBits, MessageEmbed, ActivityType, EmbedBuilder  } = require('discord.js');
require('dotenv/config')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('ready', () => {
    console.log('BOT READY')
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
            const embuilder = new EmbedBuilder()
            .setTitle('RustyBot Status').setDescription(`
            Bot: Online
            Server Location: US West

            [Support Server/RustyBust Discord Server](https://discord.gg/9MHJppvmma)`);

            message.channel.send({ embeds: [embuilder]})
        } else if (message.content === 'r.help') {

        }
    }
})

client.login(process.env.TOKEN)