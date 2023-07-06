
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
    client.user.setActivity(
        'r.help',
        { type: ActivityType.Playing }
    );
})

client.on('messageCreate', message => {
    prefix = 'r.';
    if (message.content.startsWith(prefix)) {
        command = message.content.slice(prefix.length);
        if (command === 'ping') {
            message.reply('Pong!')
        } else if (command === 'status') {
            const embuilder = new EmbedBuilder()
            .setTitle('RustyBot Status')
            .setDescription(`
            Bot Status: Online
            Current Bot Version: Unknown - In Development
            Server Location: US West

            [Support Server/RustyBust Discord Server](https://discord.gg/9MHJppvmma)
            `);

            message.channel.send({ embeds: [ embuilder ] })
        } else if (command === 'help') {
            const embuilder = new EmbedBuilder()
            .setTitle('RustyBot Help')
            .setDescription(`
            We don't have a help thing yet, ask in <#1125279778325417984> (join [Our Discord Server](https://discord.gg/9MHJppvmma))
            Prefix: \`r.\` (fixed, not changeable)
            Commands:
            \`status\`
            \`help\`
            \`ping\`
            `);
            message.channel.send({ embeds: [ embuilder ] })
        }else if (command === 'invite') {
            const embuilder = new EmbedBuilder()
            .setDescription(`
            (Invite RustyBot)[https://discord.com/api/oauth2/authorize?client_id=1058133233763627159&permissions=8&scope=bot]
            (Support Server)[https://discord.gg/9MHJppvmma]
            `)
        }
        } else if (command === 'serverinfo') {
            message.channel.send({ embeds: [ serverInfo(message.guild) ] })
        }
    }
)

client.login(process.env.TOKEN)