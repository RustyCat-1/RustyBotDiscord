module.exports = {
    command: () => {
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
                    message .channel.send(`Data for server \`${message.guildId}\` has successfully been reloaded!`);
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
    }
}