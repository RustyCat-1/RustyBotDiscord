class Node {
    constructor(key, value, prev = null, next = null, timestamp = null) {
        if(timestamp === undefined)
            this.timestamp = Date.now();
        else if (timestamp !== null)
            this.timestamp = timestamp;
        this.key = key;
        this.value = value;
        this.prev = prev;
        this.next = next;
    }
}
module.exports = {
    LRU: class {
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
        get(key) {
            return this.map[key];
            if(this.head !== null && this.tail !== null) {
                let i = this.head;
                while (i !== null) {
                    if (i === key) {
                        return i.value;
                    }
                    i = i.next;
                }
            }
            return null; // not found so we have to get the value; see configs.js
        } 
        /**
         * This method is not recommended for external use.
         * @param {*} key 
         * @param {*} value 
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
        }
        /**
         * e
         * @param {object} key 
         * @param {object} value 
         * @returns {undefined}
         */
        put(key, value) {
            if (this.head === null && this.tail === null) {
                this.head = new Node(key, value);
                this.tail = this.head;
                return;
            } 
            // let existingNode = null;
            let p = this.head;
            while (p !== null) {
                if (p.key === key) 
                    break;
                p = p.next
            }
            let existingNode = p;  
            if (existingNode !== undefined && existingNode !== null) {
                existingNode.value = value;
            } else {
                existingNode = new Node(key, value, this.tail, null);
                this.tail.next = existingNode;
                this.tail = existingNode;
                // if (this.head === this.tail){
                //     this.head.next = existingNode
                //     this.tail = existingNode
                // } else {
                //     this.tail.next = existingNode;
                //     this.tail = existingNode;
                //     // existingNode.prev = this.tail
                // }
                this.size += 1
            }
            this.map[key] = value;
            this.reduceSize();
        }
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
                throw new RangeError('Size must be more than zero')
            }
            else if (size == 0) { // we just delete the linked list haha L
                this.head = null;
                this.tail = null;
                return;
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
    },
    // WriteCache: class {
    //     head=new Node(undefined,'head', tiemstamp=null);
    //     tail=new Node(undefined, 'tail', timestamp=null);
    //     constructor(){

    //     }
    //     write(f,d){
    //         p=this.tail.prev;
    //         pn=new Node();
    //         p.next=pn
    //         this.tail.prev=pn
    //     }

    // }
}