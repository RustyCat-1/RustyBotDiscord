const { EmbedBuilder } = require('discord.js');
// const fs = require('node:fs')
const config = require('../config.json')
const docs = require('./help/docs.json');
const guildData = require('../dataAccess').guild;

module.exports = {
    execute: (message, argv) => {
        if (argv.length > 0) {
            module.exports.docs(message, argv);
            return;
        }
        const prefix = guildData.get(message.guildId).get('config.prefix');
        const embuilder = new EmbedBuilder()
            .setTitle('RustyBot Help')
            .setDescription(`
            RustyBot is a multipurpose bot that is being developed by Rusty as a fun coding project! 
            Of course, it is still in development, so the featureset is very limited. 
            Type \`${prefix}help <command>\` for help on a specific command
            Prefix: \`${prefix}\`
            `);
        message.channel.send({ embeds: [ embuilder ] });
    },
    docs: (message, argv) => {
        command = argv[0]
        let embuilder;
        if (docs[argv[0]]) {
            embuilder = new EmbedBuilder()
                .setTitle(`Command ${command}`)
                .setDescription(`**Description**:
                ${docs[command].description}`);
        } else {
            embuilder = new EmbedBuilder()
                .setTitle(`Command ${command}`)
                .setDescription('FATAL: Information could not be found on this command. Make sure you typed it correctly!')
                .setTimestamp();
        }
        message.channel.send({ embeds: [ embuilder ] });
    }
}
