const { EmbedBuilder } = require('discord.js');

module.exports = {
    command: (message) => {
        const client = message.client
        if (message.content.startsWith(prefix)) {
            emBuilder = new EmbedBuilder()
            .setTitle('Server blacklist detected!')
            .setDescription(`We are sorry for the inconvience but our bot is blacklisted on this server. Please join [our support server](https://discord.gg/9MHJppvmma) to run commands. 
    Type \`r.whyBlacklist\` or ping <@${client.user.id}> for more information.`)
            message.channel.send({ embeds: [ emBuilder ]});
        }
        if (message.content == `<@${client.user.id}>` || message.content == `r.whyBlacklist`) {
            this.info();
        }
    },
    info: (message) => {
        emBuilder = new EmbedBuilder()
            .setTitle('Server blacklist info')
            .setDescription(`**What does this mean?**
This means that your server or user is not allowed to use our bot services.
**Why is this?**
This may be because you are impersonating our support server, or violating the Discord Terms of Service.
**How can I be un-blacklisted?**
The blacklist is moderated manually, so please ask in our support server at https://discord.gg/9MHJppvmma.
If you are banned from that server, you are not eligible for an un-blacklist request at this time.
`);
        message.channel.send({ embeds: [ emBuilder ] });
    }
}
