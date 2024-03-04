const fs = require('node:fs');

const valid_id = /^[0-9]+$/;
// const illegal_windows_name = /(\/|\\)?(?<!\w)(CON|PRN|AUX|NUL|COM1|COM2|COM3|COM4|COM5|COM6|COM7|COM8|COM9|LPT1|LPT2|LPT3|LPT4|LPT5|LPT6|LPT7|LPT8|LPT9)(?!\w)(\.\w+)?/gmi

// const guildData = {};

function isString(obj) {
    return typeof obj === 'string' || obj instanceof String
}

class FileManager {
    
    /** 
     * @param {string} base  The filename to directly prepend to `id` when performing I/O operations
     * @param {string} suffix The suffix to directly append to `id` when performing I/O operations. Usually a filename extension
    */
    constructor(base, suffix) {
        if ((!isString(base)) || (!isString(suffix))) {
            throw new TypeError('`base` and `suffix` must be of type String');
        }
        this.base = base;
        this.suffix = suffix;
        this.cache = {}; // potentially dangerous because it increasingly uses memory,
        // shouldn't be a problem for smaller implementations.
        this.get('default');
    }
    
    _load(id) {
        // id = this._verify_id(id);
        let data = JSON.parse(fs.readFileSync(this.base + id + this.suffix));
        if (!JSON.stringify(data).startsWith('{')) {
            let type = 'unknown type'
            switch(JSON.stringify(data)[0]) {
                case '[':
                    type = 'array'
                    break;
                case '0', '1', '2', '3', '4', '5', '6', '7', '8', '9':
                    type = 'number';
                    break;
                case '"': 
                    type = 'string';
                    break;
                default:
                    throw new TypeError('we should never get here');
            }
            throw new TypeError('Error while loading data ' + id + '; expected object, found ' + type + ' instead');
        }
        return data;    
    }
    
    _verify_id(id) {
        if (id === undefined || arguments.length == 0) {
            throw new RangeError('Argument `id` is required');
        }
        let message = '';
        if (!isString(id)) {
            throw new TypeError('Expected String, found ' + id.constructor.name + ' instead');
        } else if (id === '') {
            message = '`id` cannot be empty';
        } else if (/(^(\/|\\)?|(\/|\\))\.\.(\/|\\)|(\<|\>|\:|\"|\||\?|\*|\n)|^ | $/.test(id)) { // security; we don't want someone to write to a system file!
            message = 'Invalid `id` value: Illegal characters';
        } 
        if (message != '') {
            throw new RangeError(message);
        }
        return id;
    }
    /**
     * 
     * @param {string} id 
     * @returns {DataNode} 
     */
    get(id) {
        id = this._verify_id(id);
        if (id in this.cache) {
            return this.cache[id];
        } else {
            let data = this._load(id);
            let datanode = new DataNode(this, data);
            this.cache[id] = datanode;
            return datanode;
        }
    }
    
    /**
     * @returns {boolean} true if the operation succeeded; otherwise, false
     */
    reload(id) {
        id = this._verify_id(id);
        try {
            this.cache[id] = new DataNode(this, this._load(id));
        } catch (e) {
            if (e instanceof TypeError) {
                throw e;
            }
            return false;
        } 
        return true;
    }
    
    set(id, value) {
        if (id === 'default') {
            throw new RangeError('cannot write to default')
        }
        id = this._verify_id(id);
        data[id] = value;
        fs.writeFile(base + id + suffix, JSON.stringify(value, undefined, 2));
    }
}

class DataNode {
    constructor(fileManager, data = undefined, id = undefined) { // TODO 3/1/2024: REMOVE Sub- DataNode stuff and just use . or / notation lookups (makes errorhandling easier)
        if (fileManager === undefined) {
            throw new RangeError('FileManager is a required argument')
        }
        
        if (fileManager instanceof FileManager) {
            this.fileManager = fileManager;
        } else {
            throw new TypeError('Expected FileManager, found ' + fileManager.constructor.name + ' instead');
        }
        if (isString(data)) {
            data = JSON.parse(data);
        }
        if (data !== undefined) { 
            this.data = {};
            for (const [k, v] of Object.entries(data)) {
                if (v === undefined) {
                    continue; // since we're using undefined as our "non-existent" value in lookups, and we can always lookup from defaults
                }
                if (v === this || v === this.parent) {
                    throw new RangeError('DataNode cannot be a circular reference');
                }
                let json = JSON.stringify(v);
                this.data[k] = v;
            }
        } else {
            this.data = {};
        }
    }
    /**
     * @param {Array | String} keys
     */
    _keysToArray(keys) {
        if (keys instanceof Array) {
            keys.forEach((val) => {
                if (!isString(val)) 
                    throw new TypeError('keys must all be of type string, String');
            });
            return keys;
        } else if (isString(keys)) {
            return keys.split('.');
        } else {
            throw new TypeError('expected Array, string, String; found ' + keys.constructor.name + ' instead')
        }
    }

    _setData(){
        
    }

    /**
     * 
     * @param {Array | String} keys
     */
    get(keys) {
        keys = this._keysToArray(keys);
        let data = this.data;
        for (const k of keys) {
            if (data === undefined) {
                return undefined;
            }
            if (!isString(k)) {
                throw new TypeError('keys must be of type String');
            }
            data = data[k];
        }
        return data;
    }
    /**
     * 
     * @param {Array|string} key 
     * @param {*} value
     */
    set(keys, value) {
        keys = this._keysToArray(keys);
        if (keys.length > 1) {
            this.get(keys.slice(0, keys.length - 1))[keys[keys.length - 1]] = value;
        } else if (keys.length == 1) {
            data[keys[0]] = value;
        } else if (keys.length == 0) {
            throw new RangeError('keys is required')
        }
        // data[keys] = JSON.parse(JSON.stringify(value));;
        // this.parent.set(this.id, this.data);
    }
    toJSON() {
        return JSON.stringify(this.data, undefined, 2);
    }

}

module.exports = {
    guild: new FileManager('./data/guild/', '.json')
};
