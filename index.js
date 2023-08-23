const Discord = require('discord.js');
const { Client, GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js');
// require('dotenv/config');
const fs = require('node:fs');
const os = require('node:os');

// local imports
const config = require('./config.json');
const ping = require('./commands/ping.js');
const whyBlacklist = require('./commands/whyBlacklist.js');
const help = require('./commands/help.js');

// client init
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});


let blacklist;
try {
    blacklist = fs.readFileSync('./config/blacklist/server.txt', 'utf8');
} catch (err) {
    console.error(err);
    blacklist = '';
}

client.on('ready', () => {
    console.log('Bot ready!')
    client.user.setStatus('available')
    client.user.setActivity(
        'r.help | https://discord.gg/9MHJppvmma',
        { type: ActivityType.Playing }
    );
});

client.on('messageCreate', message => {
    if (message.author.bot) return;
    const prefix = config.prefix;
    if (blacklist.includes(message.guildId + '\n')) {
        if (message.content === prefix + 'whyBlacklist') whyBlacklist.info(message);
        else whyBlacklist.command(message);
        return;
    }
    if (message.content === `<@${client.user.id}>`) {
        var emBuilder = new EmbedBuilder()
        .setTitle('Hi, welcome to RustyBot!')
        .setDescription('Type r.help to get started!')
    message.channel.send({
            'content': `If you can\'t see anything else, you need to turn go to Settings -> Text & Images and enable 'Embeds and Link Previews'.`,
            'embeds': [ emBuilder ]
        });
        return;
    }
    if (message.content.startsWith(prefix)) {
        const command = message.content.slice(prefix.length);
        const splits = command.split(' ');
        const base = splits[0];
        const args = splits.slice(1);
        const argc = args.length;
        if (base === 'ping') {
            ping.command(message, client.ws.ping);
        } else if (base === 'status') {
            let computer = 'custom_hosted';

            // remove following 3 lines if self-hosting or using as own bot
            computer = 'unknown';
            if (os.hostname().includes('mint')) computer = 'linux/production server';
            else if (os.hostname().includes('Mac')) computer = 'Mac/test laptop';

            const embuilder = new EmbedBuilder()
            .setTitle('RustyBot Status')
            .setDescription(`
            current bot version: v0.2.1
            Server location: US West
            Current computer: ${computer}

            **[Support Server/RustyBust Discord Server](https://discord.gg/9MHJppvmma)**
            `);

            message.channel.send({ embeds: [ embuilder ] });
        } else if (base === 'help') {
            if (argc > 0) {
                help.docs(message, args[0]);
            } else {
                help.command(message);
            }
        } else if (base === 'invite') {
            const embuilder = new EmbedBuilder()
            .setTitle('Invites:')
            .setDescription(`
            **Invite RustyBot**: [here](https://discord.com/api/oauth2/authorize?client_id=1058133233763627159&permissions=8&scope=bot).
            **Join our support server**: [here](https://discord.gg/9MHJppvmma).
            `);
            message.channel.send({ embeds: [ embuilder ] })
        } else if (base === 'analyzeArgs') {
            const embuilder = new EmbedBuilder()
            .setTitle('Analysis of this Command and Args')
            .setDescription(`
Command prefix: \`${prefix}\`
Command: \`[]\`
Command arguments: \`[${args.join(', ')}]\`
Full command: \`${message.content}\`
            `);
            message.channel.send({ embeds: [ embuilder ] })
        } else if (base === 'whyBlacklist') {
            whyBlacklist.info(message);
        }
    }
});

client.login(config.token);
