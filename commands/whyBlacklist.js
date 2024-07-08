const { EmbedBuilder } = require('discord.js');

module.exports = {
    execute: (message) => {
        const client = message.client
        if (message.content.startsWith(prefix)) {
            emBuilder = new EmbedBuilder()
            .setTitle('Blacklist detected!')
            .setDescription(`Type \`r.whyBlacklist\` or ping <@${client.user.id}> for more information.`)
            message.channel.send({ embeds: [ emBuilder ]});
        } else if (message.content == `<@${client.user.id}>` || message.content == `r.whyBlacklist`) {
            this.info();
        }
    },
    info: (message) => {
        emBuilder = new EmbedBuilder()
        .setTitle('Blacklist info')
        .setDescription(`**What does this mean?**
This means that your server or user is not allowed to use our bot services.
**Why is this?**
This may be because you are involved in an activity violating the Discord Terms of Service.
**How may I be un-blacklisted?**
The blacklist is moderated manually, so please DM <@971226149659246632> (\`rustybust\`).
`);
        message.channel.send({ embeds: [ emBuilder ] });
    }
}
