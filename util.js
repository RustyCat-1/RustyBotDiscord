const Discord = require('discord.js');

const token = require('./token.json');

module.exports = {
    debugMessage: (c, m) => {
        if (!token.debug) return;
        if (!c instanceof Discord.BaseChannel) {
            throw new TypeError('Error 32767');
        }
        c.send(`DEBUG: ${m}`);
    },
    /**
     * 
     * @param {Discord.Guild} guild 
     * @param {string | Discord.UserResolvable} query 
     * @returns 
     */
    findGuildMember: async (guild, query) => {
        let userString = query;
        let id;
        if (/^\d+$/.test(userString)) {
            id = userString;
        } else if (/^<@\d+>$/.test(userString)) {
            id = userString.slice(2, userString.length - 1);
        }
        if (id) {
            try {
                return await guild.members.fetch(id);
            } catch (e) {
                if (!e instanceof Discord.DiscordAPIError) throw e
                // if it's an API error we assume it's that the user id was invalid, so we ignore it
            }
        }
        let usernameSearch = guild.members.cache.find(member => member.user.tag === query)
        let coll = await guild.members.search({query: userString, limit: 1});
        if (coll.size !== 0) return coll.first()
    },
    /**
     * @param {Date} date
     */
    formatDate: async (date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
}