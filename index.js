const Discord = require('discord.js')
const { Client, GatewayIntentBits, MessageEmbed, ActivityType, EmbedBuilder  } = require('discord.js');
require('dotenv/config')
const fs = require('fs')
const config = require('./config.json')
const os = require('os')

const ping = require('./commands/ping.js')

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
        'r.help | https://discord.gg/9MHJppvmma',
        { type: ActivityType.Playing }
    );
});

client.on('messageCreate', message => {
    if (message.author.bot) return // prevent the bot from wasting time processing it's own messages
    prefix = config.prefix;
    if (message.content.startsWith(prefix)) {
        command = message.content.slice(prefix.length);
        splits = command.split(' ')
        base = splits[0]
        args = splits.slice(1)
        if (base === 'ping') {
            ping.command(message)
        } else if (base === 'status') {
            computer = 'no idea lol'
            if (os.hostname().includes('mint')) computer = 'production server'
            else if (os.hostname().includes('Mac')) computer = 'test laptop'

            const embuilder = new EmbedBuilder()
            .setTitle('RustyBot Status')
            .setDescription(`
            current bot version: N/A
            Server location: US West
            Current computer: ${computer}

            **[Support Server/RustyBust Discord Server](https://discord.gg/9MHJppvmma)**
            `);

            message.channel.send({ embeds: [ embuilder ] })
        } else if (base === 'help') {
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
        } else if (base === 'invite') {
            const embuilder = new EmbedBuilder()
            .setTitle(`Invites:`)
            .setDescription(`
            **Invite RustyBot**: [here](https://discord.com/api/oauth2/authorize?client_id=1058133233763627159&permissions=8&scope=bot).
            **Join our support server**: [here](https://discord.gg/9MHJppvmma).
            `)
            message.channel.send({ embeds: [ embuilder ] })
        } else if (base === 'analyzeArgs') {
            const embuilder = new EmbedBuilder()
            .setTitle('Analysis of this Command and Args')
            .setDescription(`
Command prefix: \`${prefix}\`
Command: \`[]\`
Command arguments: \`[${args.join(', ')}]\`
Full command: \`${message.content}\`
            `)
        }
    }
});

client.login(config.token); 
