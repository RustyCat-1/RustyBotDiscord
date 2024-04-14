const Discord = require('discord.js');
const { Client, GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');

const tokenFile = require('./token.json');
const configFile = require('./config.json');

const commands = require('./commands');
const ping = require('./commands/ping.js');
const whyBlacklist = require('./commands/whyBlacklist.js');
const help = require('./commands/help.js');
const dataAccess = require('./dataAccess.js');

const changelog = fs.readFileSync('changelog.md');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions
    ]
});

const blacklist = require('../data/blacklist.json');

client.on('ready', () => {
    console.log('Bot ready!');
    client.user.setStatus('available');
    if (configFile.mode === 'production')
        client.user.setActivity(
            'r.help | https://discord.gg/9MHJppvmma',
            { type: ActivityType.Playing }
        );
    else if (configFile.mode === 'test')
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

    if ((message.mentions.users.length > 0 && message.mentions.users.first().id === client.user.id) ||
     message.content === `<@${client.user.id}>` ) {
        var emBuilder = new EmbedBuilder()
        .setTitle('Hi, welcome to RustyBot!')
        .setDescription('Type r.help to get started!')
    message.channel.send({ 
            'content': `If you can\'t see anything below this message, you need to turn go to \`Settings\` -> \`Text & Images\` and enable \`Embeds and Link Previews\`.`,
            'embeds': [ emBuilder ] });
        return;
    }

    const prefix = dataAccess.guild.get(message.guildId).get('config.prefix') || `<@${client.user.id}> `;

    if (message.content.startsWith(prefix)) {
        const command = message.content.slice(prefix.length);
        const splits = command.split(' ');
        const base = splits[0];
        const argv = splits.slice(1);
        const argc = argv.length;
        if (base === 'ping') {
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
            if (argc == 0) {
                message.channel.send('Syntax is as follows:\n \`r.config (user|guild|channel) <key> [value]\`')
            }
            else if (argc == 1) {
            let mode = argv[0];
            let embuilder = new EmbedBuilder();
            switch(mode) {
                case 'user':
                    embuilder = new EmbedBuilder()
                        .setTitle(`Configuration for user \`${message.user.id}\``)
                        .setDescription(`\`\`\`json\n${dataAccess.user.get(message.user.id).toJSON()}\`\`\``);
                    message.channel.send({ embeds: [ embuilder ] });
                    break;
                case 'guild':
                    embuilder = new EmbedBuilder()
                        .setTitle(`Configuration for server \`${message.guildId}\``)
                        .setDescription(`\`\`\`json\n${JSON.stringify(dataAccess.guild.get(message.guildId).get('config'))}\`\`\``)
                        .setFooter({text: 'Note: Configuration only includes data stored within the object \`config\` contained within the datafile and does not include other server data.'});
                    message.channel.send({ embeds: [ embuilder ] });
                    break;
                case 'channel': 
                    embuilder = new EmbedBuilder()
                        .setTitle(`Configuration for channel \`${message.channelId}\``)
                        .setDescription(`\`\`\`json\n${JSON.stringify(dataAccess.guildChannel.get(message.guildId, message.channelId).get('config'))}\`\`\``)
                        .setFooter({text: 'Note: Configuration only includes data stored within the object \`config\` contained within the datafile and does not include other channel data.'});
                    message.channel.send({ embeds: [ embuilder ] });
                    break;
            }
            } else if (argc == 2) {
                if (argv[0] === 'guild' && argv[1] === 'reload') {
                    dataAccess.guild.reload(message.guildId).then(() => {
                        dataAccess.guildChannel.unloadSync(message.channelId);
                    }).then(async () => {
                        message.channel.send(`Data for server \`${message.guildId}\` has successfully been reloaded!`);
                    }).catch((error) => {
                        message.channel.send(`An error occurred whilst reloading server data for \`${message.guildId}\`.`);
                    });
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
        } else {
            const embuilder = new EmbedBuilder()
            .setDescription(`\`${base}\` is not a valid command.`);
            message.channel.send({ embeds: [ embuilder ] });
        }
    }
});

client.on('guildMemberAdd', async (member) => {
    try {
        let welcomeChannel = dataAccess.guild.get(member.guild.id).get('config.welcome_channel');
        if (!welcomeChannel) return;
        let channel = await client.channels.fetch(welcomeChannel.toString());
        channel.send(`Welcome <@${member.user.id}> to ${member.guild.name}!`);
    } catch (e) {
        console.error(e);
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();

    let channel = reaction.message.channel;

    if(user.bot) return;
    if(!reaction.message.guild) return;

    if(!reaction.message.channel) {console.err('undef');return;}
    console.log('d');
    console.log(reaction.message.channelId)
    console.log(dataAccess.guildChannel.getFromObj(channel))
    if(reaction.message.id in dataAccess.guildChannel.getFromObj(channel).get('reaction_roles')) {
        reaction.message.channel.send('`cahnenl`');
        if(dataAccess.guildChannel.getFromObj(channel).get('reaction_roles') && reaction.message.id in dataAccess.guildChannel.getFromObj(channel).get(`reaction_roles.${reaction.message.id}`)) {
            reaction.message.channel.send('Success! You have done it!');
        }
    }
});

if (process.argv.length > 2) {
    console.log('Logging in using test mode...');
    client.login(tokenFile.test_token);
} else {
    console.log('Logging in...');
    client.login(tokenFile.production_token);
}
