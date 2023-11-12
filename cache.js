const {
    Worker, isMainThread, parentPort, workerData,
  } = require('node:worker_threads');

class Node {
    constructor(key, value, prev = null, next = null, timestamp = undefined) {
        if(timestamp !== undefined)
            this.timestamp = Date.now();
        else if (timestamp !== null)
            this.timestamp = timestamp
        this.key = key;
        this.value = value;
        this.prev = prev;
        this.next = next;
    }
}
module.exports = {
    LRU: class {
        constructor(maxSize) {
            this.size = 0
            this.maxSize = maxSize;
            this.map = {};
            this.head =new Node(undefined, 'head',null,null,null);
            this.tail =new Node(undefined, 'tail',null,null,null);
        }
        get(key) {
            let i = this.head;
            while (i !== null) {
                if (i === key) {
                    return i.value;
                }
                i = i.next;
            }
            return null; // not found so we have to get the value; see configs.js
        } 
        /**
         * 
         * @param {object} key 
         * @param {object} value 
         */
        put(key, value) {
            let existingNode = this.map[key];
            if (existingNode !== undefined) {
                existingNode.value = value;
            } else {
                existingNode = new Node(key, value, null, this.tail);
                this.tail.prev = existingNode;
                this.size += 1
            }
            while (this.size < this.maxSize) {
                let h = this.head;
                this.head.next = h.next.next;
                h.next = null; // make sure it doesn't connect, even oneway
                size -= 1
            }
        }
        remove(key) {
            let i = this.head;
            while (i !== null) {
                if (i.key === key) {
                    i.prev.next = i.next;
                    this.size -= 1;
                    break
                }
            }
        }
    },
    // WriteCache: class {
    //     /**
    //      * bruh
    //     */
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