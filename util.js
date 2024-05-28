const Discord = require('discord.js');

const token = require('./token.json');

module.exports = {
    debugMessage: (c, m) => {
        if (!token.debug) return;
        if (!c instanceof Discord.BaseChannel) {
            throw new TypeError('c instanceof BaseChannel must be true');
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
            return await guild.members.fetch(id);
        }
        let coll = await guild.members.search({query: userString, limit: 1});
        return coll.size === 0 ? null : coll.first();
    },
    /**
     * @param {Date} date
     */
    formatDate: async (date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
}