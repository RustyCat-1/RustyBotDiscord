
// import

function serverInfo(guild){
    return guild.available ? new EmbedBuilder()
    .setTitle(`Server information for ${guild.name} (${guild.id})`)
    .setDescription(
        `Creation Time: ${guild.createdAt}`
    ) : new Discord.EmbedBuilder()
    .setTitle('Server information for ${guild.name} (${guild.id})')
    .setDescription('error, try again later')
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
    console.log('Bot ready!')
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
        if (message.content === 'r.ping') {
            message.reply('Pong!')
        } else if (message.content === 'r.status') {
            const embuilder = new EmbedBuilder()
            .setTitle('RustyBot Status')
            .setDescription(`
            Bot Status: Online
            Current Bot Version: Unknown - In Development
            Server Location: US West

            [Support Server/RustyBust Discord Server](https://discord.gg/9MHJppvmma)
            `);

            message.channel.send({ embeds: [ embuilder ] })
        } else if (message.content === 'r.help') {
            const embuilder = new EmbedBuilder()
            .setTitle('RustyBot Help')
            .setDescription(`
            We don't have a help thing yet, ask in <#1125279778325417984> (join [Our Discord Server](https://discord.gg/9MHJppvmma))
            Prefix: \`r.\` (fixed, not changeable)
            Commands:
            status
            help
            ping
            `);
            message.channel.send({ embeds: [ embuilder ] })
        } else if (message.content === 'r.serverinfo') {
            message.channel.send({ embeds: [ serverInfo(message.guild) ] })
        }
    }
})

client.login(process.env.TOKEN)