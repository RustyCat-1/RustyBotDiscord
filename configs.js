const fs = require('node:fs');

const valid_id = /^[0-9]+$/;
const maxCacheArrayLength = 1024;

const cache = require('./cache.js');

const lru_cache = new cache.LRU(maxCacheArrayLength);

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
     * @returns {object} The configuration object of the guild, as a copy
     */
    getServerConfig: function (id) {
        cache_value = lru_cache.get(id)
        if (cache_value === null) {
            let raw;
            try {
                raw = fs.readFileSync('./config/server/' + id + '.json')
            } catch (err) {
                raw = 'file could not be read'
            }
            let data;
            if (raw !== 'file could not be read') {
                data = JSON.parse(raw);
            } else {
                data = raw;
            }
            lru_cache.put(id, data)
            return data;
        }
    },
    /**
     * 
     * @param {string} id The numerical ID of the guild, in a string 
     * @param {string} key The key of the configuration item to get
     * @returns {object}
     */
    getServerConfigProperty: function (id, key) {
        return this.getServerConfig(id)[key]
    },
    /**
     * 
     * @param {string} id The numerical ID of the guild, in a string
     * @param {object} obj The configuration object of the guild
     */
    setServerConfig: function(id, obj) {
        fs.writeFile('./config/server/'+id,JSON.stringify(obj))
        lru_cache.put(id, obj)
    },
    /**
     * 
     * @param {string} id The numerical ID of the guild, in a string
     * @param {string} key The key of the configuration item to set
     * @param {*} value The value to set the configuration item to
     */
    setServerConfigProperty: function (id, key, value) {
        obj = this.getServerConfig(id)
        obj['key'] = value
        return this.setServerConfig(id, obj)
    }
};