const dataManager = require('./dataManager.js')

const configFile = require('./config.json');

const ChannelDataManager = class {

    getReactionChannel(reaction) {
        return module.exports.channel.get(reaction.messsage.guildId, reaction.message.channelId);
    }
    constructor() {
        this.cache = {};
    }
    _verify_id(id) {
        return dataManager.FileManager._verify_id(id)
    }
    _load(guildId, channelId) {
        return module.exports.guild.get(guildId) ? module.exports.guild.get(guildId).get(`channels.${channelId}`) : undefined;
    }
    get(guildId, channelId) {
        if (channelId in this.cache) {
            return this.cache[channelId];
        } else {
            let data = this._load(guildId, channelId);
            if(!data) return undefined;
            let datanode = new dataManager.DataNode(data);
            this.cache[channelId] = datanode;
            return datanode;
        }
    }
    set(guildId, channelId, data) {
        id = this._verify_id(guildId);
        module.exports.guild.get(guildId).set(`channels.${channelId}`, data);
        if (this.cache[id]) this.cache[id].data = new dataManager.DataNode(data);
    }
};

module.exports = {
    guild: new dataManager.FileManager(configFile.data_path + 'guild/', '.json'),
    user: new dataManager.FileManager(configFile.data_path + 'user/', '.json'),
    channel: new ChannelDataManager()
};
