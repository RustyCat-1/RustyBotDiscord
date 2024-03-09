const dataManager = require('./dataManager.js')

const configFile = require('config.json');

module.exports = {
    guild: new dataManager.FileManager(configFile.data_path + '/guild/', '.json'),
    user: new dataManager.FileManager(configFile.data_path + '/user/', '.json'),
};
