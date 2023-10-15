const { EmbedBuilder } = require('discord.js');
// const fs = require('node:fs')
const docs = require('./help/docs.json');

module.exports = {
    command: (message, prefix) => {
        commandsList = `ping
status
help
invite
info`
        const embuilder = new EmbedBuilder()
            .setTitle('RustyBot Help')
            .setDescription(`
            Type \`${prefix}help <command>\` for help on a specific command
            Support: <#1125279778325417984> (join [Our Discord Server](https://discord.gg/9MHJppvmma))
            Prefix: \`${prefix}\` (fixed, not changeable)
            List of commands:
            \`${commandsList} \`
            `);
        message.channel.send({ embeds: [ embuilder ] });
    },
    docs: (message, command) => {
        let embuilder;
        if (docs[command] !== undefined) {
            embuilder = new EmbedBuilder()
                .setTitle(`Command ${command}`)
                .setDescription(`**Description**:
                ${docs[command].description}`);
        } else {
            embuilder = new EmbedBuilder()
                .setTitle(`Command ${command}`)
                .setDescription('Information could not be found on this command. Make sure you typed it correctly!')
                .setTimestamp();
        }
        message.channel.send({ embeds: [ embuilder ] });
    }
}
