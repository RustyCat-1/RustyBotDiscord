const Discord = require('discord.js');
const { Client, GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js');
// require('dotenv/config');
const fs = require('node:fs');
const os = require('node:os');

const tokenfile = require('./token.json');
const config = require('./config.json')
const ping = require('./commands/ping.js');
const whyBlacklist = require('./commands/whyBlacklist.js');
const help = require('./commands/help.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const serverBlacklist = fs.readFileSync('./config/blacklist/server.txt', 'utf8');
const userBlacklist = fs.readFileSync('./config/blacklist/server.txt', 'utf8');

client.on('ready', () => {
    console.log('Bot ready!')
    client.user.setStatus('available')
    if (config.mode === 'production')
    client.user.setActivity(
        'r.help | https://discord.gg/9MHJppvmma',
        { type: ActivityType.Playing }
    );
    else if (config.mode === 'production')
    client.user.setActivity(
        'r.help in Test Mode. Please report any bugs you find.',
        { type: ActivityType.Playing }
    );
});

client.on('messageCreate', message => {
    if (message.author.bot) return;
    if (serverBlacklist.includes(message.guildId + '\n') | 
        userBlacklist.includes(message.author.id + '\n')) {
        return;
    }
        if (message.content === `<@${client.user.id}>`) {
        var emBuilder = new EmbedBuilder()
        .setTitle('Hi, welcome to RustyBot!')
        .setDescription('Type r.help to get started!')
    message.channel.send({
            'content': `If you can\'t see anything below this message, you need to turn go to \`Settings -> Text & Images\` and enable 'Embeds and Link Previews'.`,
            'embeds': [ emBuilder ]
        });
        return;
    }

    const prefix = config.prefix;
    if (message.content.startsWith(prefix)) {
        const command = message.content.slice(prefix.length);
        const splits = command.split(' ');
        const base = splits[0];
        const args = splits.slice(1);
        const argc = args.length;
        if (base === 'ping') {
            ping.command(message, client.ws.ping);
        } else if (base === 'status') {
            
            const embuilder = new EmbedBuilder()
            .setTitle('RustyBot Status')
            .setDescription(`
            current bot version: ${config.version}
            Server physical location: US West Coast

            **[Support Server](https://discord.gg/9MHJppvmma)**
            `);

            message.channel.send({ embeds: [ embuilder ] });
        } else if (base === 'help') {
            if (argc > 0) {
                help.docs(message, args[0]);
            } else {
                help.command(message, prefix);
            }
        } else if (base === 'invite') {
            const embuilder = new EmbedBuilder()
            .setTitle('Invites:')
            .setDescription(`
            **Invite RustyBot**: [here](https://discord.com/api/oauth2/authorize?client_id=1058133233763627159&permissions=8&scope=bot).
            **Join our support server**: [here](https://discord.gg/9MHJppvmma).
            `);
            message.channel.send({ embeds: [ embuilder ] });
        } else if (base === 'whyBlacklist') {
            whyBlacklist.info(message);
        }
    }
});

client.login(tokenfile.token);
