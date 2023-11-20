class Node {
    constructor(key, value, prev = null, next = null, timestamp = null) {
        // if(timestamp === undefined)
        //     this.timestamp = Date.now();
        // else if (timestamp !== null)
        //     this.timestamp = timestamp;
        this.key = key;
        this.value = value;
        this.prev = prev;
        this.next = next;
    }
}
module.exports = {
    /**
     * A class that serves as an Least Recently Used cache.
     */
    LRU: class {
        /**
         * Instaniate an instance of this class.
         * @param {int} maxSize The maximum size the cache can reach, as a integer.
         */
        constructor(maxSize) {
            if (maxSize < 1) {
                throw new RangeError('Maxsize must be greater than 0')
            }
            this.size = 0
            this.maxSize = maxSize;
            this.map = {};
            this.head = null;
            this.tail = null;
        }
        /**
         * Get an value using a key, refreshing in the process.
         * @param {*} key The key of the cache-item.
         * @returns {*} The value that was retrieved from the cache 
         */
        get(key) {
            if(this.size === 1)
                return this.head.key === key ? this.head.value : null;
            let node = this._getNode(key);
            if(node.next === null) {}
            else if(node.prev === null) {
                node.next.prev = null;
                this.head = node.next;
                this.tail.next = node;
                node.prev = this.tail;
                node.next = null;
                this.tail = node;
            } 
            return node === null ? null : node.value;
        } 
        /**
         * This method is not recommended for external use and is designated for internal purposes only. Use {@link get} instead.
         * @param {*} key The key of the cache-item.
         * @returns {Node} 
         */
        _getNode(key) {
            // return this.map[key];
            if (this.head !== null && this.tail !== null) {
                let i = this.head;
                while (i !== null) {
                    if (i.key === key) {
                        return i;
                    }
                    i = i.next;
                }
            } else {
                return this.head.key === key ? this.head : null;
            }
            return null; // not found so we have to get the value; see configs.js
        }
        /**
         * This method is not recommended for external use and is designated for internal purposes only. Use {@link put} instead.
         * @param {*} key The key of the cache-item.
         * @param {*} value The value of the cache-item.
         * @returns {undefined} 
         */
        _append(key, value) {
            if (this.head === null && this.tail === null) {
                this.head = new Node(key, value);
                this.tail = this.head;
                return;
            } 
            let newnode = new Node(key, value, this.tail);
            this.tail.next = newnode;
            this.tail = newnode;
            this.size++;
        }
        /**
         * Add an item to the cache or update value of an existing item
         * @param {*} key The key of the cache-item.
         * @param {*} value The value of the cache-item.
         * @returns {undefined}
         */
        put(key, value) {
            if (this.head === null && this.tail === null) {
                this.head = new Node(key, value);
                this.tail = this.head;
                this.size = 1;
                return;
            } 
            let p = this.head;
            while (p !== null) {
                if (p.key === key)
                    break;
                p = p.next
            }
            let existingNode = p;
            if (existingNode !== undefined && existingNode !== null) {
                this._getNode(key).value = value;
            } else {
                this._append(key, value);
            }
            this.map[key] = value;
            this.reduceSize();
        }
        /**
         * Remove an item from the cache.
         * @param {*} key The key of the cache-item.
         */
        remove(key) {
            let i = this.head;
            while (i !== null) {
                if (i.key === key) {
                    if (i === this.head) {
                        this.head = i.next;
                        break;
                    }
                    i.prev.next = i.next;
                    this.size -= 1;
                    break;
                }
                i = i.next;
            }
            delete this.map[key]
        }
        reduceSize(size=this.maxSize){
            if (size < 0) { // imagine negative size
                throw new RangeError('Size must be <0')
            }
            else if (size == 0) { // we just delete the linked list haha L
                this._deleteAll();
            } 
            else if (this.size == 0) { // negative size?!?!!
                return;
            }
            while (0 < this.size > size) {
                let h = this.head;
                let n = h.next;
                h.next = null;
                h.prev = null;
                n.prev = null;
                this.head=n;
                if (n == null)
                    return;
                this.size -= 1;
            }
        }
        _deleteAll() {
            this.head = null;
            this.tail = null;
            this.size = 0;
            this.map = {};
            return;
        }
    },
}