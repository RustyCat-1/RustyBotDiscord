const fs = require('node:fs');

function isString(obj) {
    return typeof obj === 'string' || obj instanceof String;
}
function isNumber(obj) {
    return typeof obj === 'number' || obj instanceof Number;
}

class FileManager {
    /** 
     * @param {string} base The filename to directly prepend to `id` when performing I/O operations
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
            let type = data.constructor.name;
            switch(JSON.stringify(data)[0]) {
                case '[':
                    type = 'array'
                    break;
                case '0', '1', '2', '3', '4', '5', '6', '7', '8', '9':
                    type = 'number';
                    break;
                case '"', "'":
                    type = 'string';
                    break;
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
    reload(id) { // note: re-implement using promise/future or async
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
    /**
     * @param {FileManager} fileManager
    */
    constructor(fileManager, data = undefined, id = undefined) { 
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
                    continue; // undefined = non-existent 
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
     * @param {Array | string} keys
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
            throw new TypeError('expected Array, string; found ' + keys.constructor.name + ' instead')
        }
    }

    /**
     * 
     * @param {Array | string} keys
     * @returns {object | string | Array}
     */
    get(keys) {
        keys = this._keysToArray(keys);
        let data = this.data;
        for (const k of keys) {
            if (data === undefined) {
                return undefined;
            }
            if (!isString(k)) {
                throw new TypeError('keys must all be of type String');
            }
            data = data[k];
        }
        return data;
    }
    /**
     * 
     * @param {Array | string} keys
     * @param {*} value
     */
    set(keys, value) {
        keys = this._keysToArray(keys);
        if (keys.length > 1) {
            this.get(keys.slice(0, keys.length - 1))[keys[keys.length - 1]] = value;
        } else if (keys.length == 1) {
            data[keys[0]] = value;
        } else if (keys.length == 0) {
            throw new RangeError('keys is required');
        }
    }
    
    /**
     * @returns {string} A string-JSON representation of this object's contents.
    */
    toJSON() {
        return JSON.stringify(this.data, undefined, 2);
    }

}

module.exports = { FileManager: FileManager, DataNode: DataNode };