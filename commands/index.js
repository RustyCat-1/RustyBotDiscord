const { EmbedBuilder } = require('discord.js');
const util = require('../util.js')

module.exports = {
    'help': require('./help'),
    'ping': require('./ping'),
    'whyBlacklist': require('./whyBlacklist'),
    'userinfo': {
        execute: async (message, args) => {
            if (args.length == 0) {
                message.channel.send('You need to pass a user to lookup to the command.');
            } else {
                let query = args.join(' ')
                message.channel.sendTyping();
                let member = await util.findGuildMember(message.guild, query);
                util.debugMessage(message.channel, member);
                if (member == null) {
                    message.channel.send('Member could not be found.');
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
                Currently in timeout? ${member.communicationDisabledUntil !== null ? '✅' : '❌'}
                `);
                message.channel.send({embeds: [embuilder]});
            }
        }
    }
};