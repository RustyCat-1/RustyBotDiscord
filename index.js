const Discord = require('discord.js');
const { Client, GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');

const tokenFile = require('./token.json');
const configFile = require('./config.json')
const ping = require('./commands/ping.js');
const whyBlacklist = require('./commands/whyBlacklist.js');
const help = require('./commands/help.js');
const dataAccess = require('./dataAccess.js')

const changelog = fs.readFileSync('changelog.txt')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const blacklist = require('./data/blacklist.json');
const perms = require('./data/perms.json')


client.on('ready', () => {
    console.log('Bot ready!')
    client.user.setStatus('available')
    if (tokenFile.mode === 'production')
        client.user.setActivity(
            'r.help | https://discord.gg/9MHJppvmma',
            { type: ActivityType.Playing }
        );
    else if (tokenFile.mode === 'test')
        client.user.setActivity(
            'RustyBot in Test Mode. Please report any bugs you find!',
            { type: ActivityType.Watching }
        );
});

client.on('messageCreate', message => {
    if (message.author.bot) return;
    if (message.guildId in blacklist.guilds ||
        message.author.id in blacklist.users) {
        return;
    }
    if (message.content === `<@${client.user.id}>`) {
        var emBuilder = new EmbedBuilder()
        .setTitle('Hi, welcome to RustyBot!')
        .setDescription('Type r.help to get started!')
    message.channel.send({ 
            'content': `If you can\'t see anything below this message, you need to turn go to \`Settings\` -> \`Text & Images\` and enable \`Embeds and Link Previews\`.`,
            'embeds': [ emBuilder ] });
        return;
    }
    //  console.log(message.guildId); // TEST
    // console.log(dataAccess.guild.get(message.guildId))
    const prefix = dataAccess.guild.get(message.guildId).get('config.prefix') || `<@${client.user.id}> `;
    
    if (message.content.startsWith(prefix)) {
        const command = message.content.slice(prefix.length);
        const splits = command.split(' ');
        const base = splits[0];
        const argv = splits.slice(1);
        const argc = argv.length;
        if (base == 'admin') {
            if (message.user.id in perms.admin) {
                // do something
            }
        } else if (base === 'ping') {
            ping.command(message, client.ws.ping);
        } else if (base === 'status') {
            const embuilder = new EmbedBuilder()
            .setTitle('RustyBot Status')
            .setDescription(`
            Current bot version: ${configFile.version}

            **[Support Server](https://discord.gg/9MHJppvmma)**
            `);

            message.channel.send({ embeds: [ embuilder ] });
        } else if (base === 'help') {
            if (argc > 0) {
                help.docs(message, argv[0]);
            } else {
                help.command(message);
            }
        } else if (base === 'invite') {
            const embuilder = new EmbedBuilder()
            .setTitle('Invites:')
            .setDescription(`
            **Invite RustyBot**: [here](https://discord.com/api/oauth2/authorize?client_id=1058133233763627159&permissions=8&scope=bot)
            **Join our support server**: [here](https://discord.gg/9MHJppvmma)
            `);
            message.channel.send({ embeds: [ embuilder ] });
        } else if (base === 'config') {
            if (argc == 0)
                message.channel.send('Syntax is as follows:\n \`r.config (user|guild|channel) <key> [value]\`')
            else if (argc == 1) {
                let mode = argv[0];
                let embuilder = new EmbedBuilder();
                switch(mode) {
                    case 'user', 'channel':
                        message.channel.send('This feature has not been implemented yet or is not available to you at the moment.')
                        break;
                    case 'guild':
                        embuilder = new EmbedBuilder()
                            .setTitle(`Configuration for server \`${message.guildId}\``)
                            .setDescription(`\`\`\`json\n${dataAccess.guild.get(message.guildId).toJSON()}\`\`\``);
                        message.channel.send({ embeds: [ embuilder ] });
                        break;
                }
            }
            else if (argc == 2) {
                if(argv[0] === 'guild' && argv[1] === 'reload') {
                    dataAccess.guild.reload(message.guildId);
                    message.channel.send(`Data for server \`${message.guildId}\` has been reloaded!`)
                    return;
                }
                let embuilder;
                try {
                    embuilder = new EmbedBuilder()
                    .setTitle(`Value of key \`${argv[1]}\``)
                    .setDescription(`
                    \`\`\`${JSON.stringify(dataAccess.guild.get(message.guildId).get(argv[1]))}\`\`\`
                    `);
                } catch (TypeError) {
                    embuilder = new EmbedBuilder().setTitle('An error occurred. Please try again.')
                }
                message.channel.send({ embeds: [ embuilder ] });
                }
        } else if (base === 'whyBlacklist') {
            whyBlacklist.info(message);
        } else if (base === 'changelog') {
            const embuilder = new EmbedBuilder()
            .setDescription(changelog);
            message.channel.send({ embeds: [ embuilder ] });
        }
    }
});

client.on('guildMemberAdd', (member) => {
    try {
        let wel_chan = dataAccess.get(member.guildId).get('config.welcome_channel');
        if (wel_chan !== null) {
            let c = member.guild.channels.cache.get(wel_chan);
            c.send(`Welcome ${member.user.tag}`)
        }
    } catch (e) {
        // do nothing lol
    }
})

if (process.argv.length > 2) {
    console.log('Logging in using test mode...');
    client.login(tokenFile.test_token);
} else {
    console.log('Logging in...');
    client.login(tokenFile.production_token);
} 