const dataManager = require('./dataManager.js')

const configFile = require('./config.json');

class GuildChannelDataManager extends dataManager.DataManager {
    constructor() {
        super();
    }
    static _verify_id(id) {
        return dataManager.FileManager._verify_id(id)
    }
    _load(guildId, channelId) {
        super._load();
        return module.exports.guild.get(guildId) ? module.exports.guild.get(guildId).get(`channels.${channelId}`) : undefined;
    }
    get(guildId, channelId) {
        if (guildId in this.cache) {
            if (channelId in this.cache[guildId])
            return this.cache[guildId][channelId];
        } else {
            let data = this._load(guildId, channelId);
            if(!data) return undefined;
            if(!data[guildId]) this.cache[guildId] = {};
            let datanode = new dataManager.DataNode(data);
            this.cache[guildId][channelId] = datanode;
            return datanode;
        }
    }
    /**
     * 
     * @param {GuildChannel} channelObj 
     */
    getFromObj(channelObj) {
        return this.get(channelObj.guildId, channelObj.id);
    }
    
    set(guildId, channelId, data) {
        guildId = GuildChannelDataManager._verify_id(guildId);
        module.exports.guild.get(guildId).set(`channels.${channelId}`, data);
        this.cache[guildId][channelId].data = new dataManager.DataNode(data);
    }
};

module.exports = {
    guild: new dataManager.FileManager(configFile.data_path + 'guild/', '.json'),
    user: new dataManager.FileManager(configFile.data_path + 'user/', '.json'),
    guildChannel: new GuildChannelDataManager()
};
