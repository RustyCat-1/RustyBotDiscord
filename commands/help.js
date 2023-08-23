const { EmbedBuilder } = require('discord.js')
const fs = require('fs')
const docs = require('./help/docs.json')

module.exports = {
    commandsList: fs.readFileSync('./commands.txt', 'utf8'),
    command: (message) => {
            let commandsList;
            try {
                commandsList = fs.readFileSync('../config/blacklist/server.txt', 'utf8');
            } catch (err) {
                console.error(err);
                commandsList = 'Could not read "config/blacklist/server.txt"';
            }
            const embuilder = new EmbedBuilder()
                .setTitle('RustyBot Help')
                .setDescription(`
                Type \`${prefix}help <command>\` for help on a specific command
                Support: <#1125279778325417984> (join [Our Discord Server](https://discord.gg/9MHJppvmma))
                Prefix: \`${prefix}\` (fixed, not changeable)
                List of commands:
                \`\`\`
                ${commandsList}
                \`\`\`
                `);
            message.channel.send({ embeds: [ embuilder ] })
        // }
    },
    docs: (message, command) => {
        let embuilder
        if (docs[command] !== undefined) {
            embuilder = new EmbedBuilder()
                .setTitle(`Command ${command}`)
                .setDescription(`**Description**:
                ${docs[command].description}`)
        } else {
            embuilder = new EmbedBuilder()
                .setTitle(`Command ${command}`)
                .setDescription('Information could not be found on this command. Make sure you typed it correctly!')
        }
        message.channel.send({ embeds: [ embuilder ] })
    }
}
