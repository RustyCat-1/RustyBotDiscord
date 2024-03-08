const dataManager = require('./dataManager.js')

module.exports = {
    guild: new dataManager.FileManager('./data/guild/', '.json'),
    user: new dataManager.FileManager('./data/user/', '.json'),
};
