const Discord = require('discord.js')
const { Client, GatewayIntentBits, MessageEmbed, ActivityType, EmbedBuilder } = require('discord.js');
require('dotenv/config')
const fs = require('fs')
const config = require('./config.json')
const os = require('os')

const ping = require('./commands/ping.js')
const whyBlacklist = require('./commands/whyBlacklist.js')

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
    if (message.author.bot) return // prevent the bot from wasting time 
    prefix = config.prefix;
    if (message.guildId == '952018658664804424') {
        if (message.content === prefix + 'whyBlacklist') whyBlacklist.info(message)
        else whyBlacklist.command(message)
        return
    }
    if (message.content == `<@${client.user.id}>`) {
        var emBuilder = new EmbedBuilder()
        .setTitle('Hi, welcome to RustyBot!')
        .setDescription('Type r.help to get started!')
    message.channel.send({
            'content': `If you can\'t see anything else, you need to turn go to Settings -> Text & Images and enable 'Embeds and Link Previews'.`,
            'embeds': [ emBuilder ]
        })
        return
    }
    if (message.content.startsWith(prefix)) {
        command = message.content.slice(prefix.length);
        splits = command.split(' ')
        base = splits[0]
        args = splits.slice(1)
        if (base === 'ping') {
            ping.command(message)
        } else if (base === 'status') {
            computer = 'unknown'
            if (os.hostname().includes('mint')) computer = 'linux/production server'
            else if (os.hostname().includes('Mac')) computer = 'Mac/test laptop'

            const embuilder = new EmbedBuilder()
            .setTitle('RustyBot Status')
            .setDescription(`
            current bot version: Alpha v0.1
            Server location: US West
            Current computer: ${computer}

            **[Support Server/RustyBust Discord Server](https://discord.gg/9MHJppvmma)**
            `);

            message.channel.send({ embeds: [ embuilder ] })
        } else if (base === 'help') {
            if (args.length < 1) {
                const embuilder = new EmbedBuilder()
                .setTitle('RustyBot Help')
                .setDescription(`
                Type \`${prefix}help <command>\` for help on a specific command
                Support: <#1125279778325417984> (join [Our Discord Server](https://discord.gg/9MHJppvmma))
                Prefix: \`${prefix}\` (fixed, not changeable)
                `);
            }
            message.channel.send({ embeds: [ embuilder ] })
        } else if (base === 'invite') {
            const embuilder = new EmbedBuilder()
            .setTitle('Invites:')
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
            message.channel.send( { embeds: [ embuilder ] })
        } else if (base === 'whyBlacklist') {
            whyBlacklist.info(message)
        }
    }
});

client.login(config.token); 
