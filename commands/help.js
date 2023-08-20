const { EmbedBuilder } = require('discord.js')
const fs = require('fs')

module.exports = {
    commandsList: fs.readFileSync('./commands.txt', 'utf8'),
    command: (message, args) => {
        if (args.length >0) {
            message.channel.reply('Feature under development, maybe will add in the next version?')
            //#if (this.commandsList.includes(args[0])) {

            //}
        }
        else if (args.length <= 0) {
            const embuilder = new EmbedBuilder()
                .setTitle('RustyBot Help')
                .setDescription(`
                Type \`${prefix}help <command>\` for help on a specific command
                Support: <#1125279778325417984> (join [Our Discord Server](https://discord.gg/9MHJppvmma))
                Prefix: \`${prefix}\` (fixed, not changeable)
                `);
            message.channel.send({ embeds: [ embuilder ] })
        }
    }  
}
