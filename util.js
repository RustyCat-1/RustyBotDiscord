export function ensureNonFalse(obj) {
    if(obj === false){return;}
    if(!obj) {
        throw new RangeError('Value cannot be ');
    }
}