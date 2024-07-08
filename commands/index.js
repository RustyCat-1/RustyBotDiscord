const { EmbedBuilder } = require('discord.js');
const util = require('../util.js')

module.exports = {
    'config': require('./config'),
    'help': require('./help'),
    'ping': require('./ping'),
    'whyBlacklist': require('./whyBlacklist'),
    'memberinfo': {
        execute: async (message, args) => {
            if (args.length == 0) {
                message.channel.send('WARN: Please pass a user to lookup to the command.');
            } else {
                let query = args.join(' ')
                message.channel.sendTyping();
                let member = await util.findGuildMember(message.guild, query);
                util.debugMessage(message.channel, member);
                if (!member) {
                    message.channel.send('FATAL: Member could not be found.');
                    return;
                }
                await member.fetch();
                await member.user.fetch();
                let embuilder = new EmbedBuilder()
                .setTitle('User lookup')
                .setDescription(`
                User: <@${member.id}>
                ID: \`${member.id}\`
                Display name/Nickname: \`${member.displayName}\`
                Tag: \`${member.user.tag}\`
                Joined server: ${await util.formatDate(member.joinedAt)}
                `);
                message.channel.send({embeds: [embuilder]});
            }
        }
    }
};