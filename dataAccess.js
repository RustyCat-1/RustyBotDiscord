const fs = require('node:fs');

const valid_id = /^[0-9]+$/;

const guildData = {};

module.exports = {
    /**
     * 
     * @param {string} id The numerical ID of the guild, in a string
     * @returns {boolean} Whether the ID is valid
     */
    validate: (id) => {
        return valid_id.test(id);
    },
    /**
     * 
     * @param {string} id The numerical ID of the guild, in a string
     * @returns {object} The configuration object of the guild
     */
    getGuildData: function (id) {
        if (!(id in guildData)) {
            let raw;
            try {
                raw = fs.readFileSync('./data/guild/' + id + '.json')
            } catch (err) {
                console.log(err)
                return undefined
            }
            return JSON.parse(raw);
        } else {
            return guildData[id]
        }
    },
    /**
     * 
     * @param {string} id The numerical ID of the guild, in a string 
     * @param {string} key The key of the configuration item to get
     * @returns {object}
     */
    getGuildDataProperty: function (id, key) {
        obj = this.getGuildData(id)
        return obj === undefined ? undefined : (key in obj ? obj[key] : undefined)
    },
    /**
     * 
     * @param {string} id The numerical ID of the guild, in a string
     * @param {object} obj The configuration object of the guild
     */
    setGuildConfig: function(id, obj) {
        guildData[id] = obj
        fs.writeFile('./data/guild/'+id, JSON.stringify(obj))
    },
    /**
     * 
     * @param {string} id The numerical ID of the guild, in a string
     * @param {string} key The key of the configuration item to set
     * @param {*} value The value to set the configuration item to
     */
    setGuildDataProperty: function (id, key, value) {
        obj = this.getGuildData(id)
        obj['key'] = value
        return this.setGuildConfig(id, obj)
    },
    reloadGuildData: function(id) {
        try {
            guildData[id] = JSON.parse(fs.readFileSync('./data/guild/' + id + '.json'))
        } catch (err) {
            // pass
        }
    }
};