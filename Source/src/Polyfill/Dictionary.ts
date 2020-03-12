///stolen from calico-crusade again
export class Dictionary<K, V> {
    private Keys: K[];
    private Values: V[];

    constructor() {
        this.Keys = [];
        this.Values = [];
    }

    add(key: K, val: V) {
        if (this.Keys.indexOf(key) != -1) {
            this.Values[this.Keys.indexOf(key)] = val;
            return;
        }
        this.Keys.push(key);
        this.Values.push(val);
    }

    remove(key: K) {
        var i = this.Keys.indexOf(key);
        if (i != -1) {
            this.Keys.splice(i, 1);
            this.Values.splice(i, 1);
        }
    }

    get(key: K): V {
        var i = this.Keys.indexOf(key);
        if (i === -1)
            return null;
        return this.Values[i];
    }

    contains(key: K): boolean {
        return this.Keys.indexOf(key) != -1;
    }

    all(): KeyValuePair<K, V>[] {
        var values: KeyValuePair<K, V>[] = [];
        for (var i = 0; i < this.Keys.length; i++) {
            values.push(new KeyValuePair<K, V>(this.Keys[i], this.Values[i]));
        }
        return values;
    }

    getBy(fn: (key: K, val?: V) => any) : V {
        for(var i = 0; i < this.Keys.length; i++) {
            if (fn(this.Keys[i], this.Values[i])) {
                return this.Values[i];
            }
        }
        return undefined;
    }
}

export class KeyValuePair<K, V> {
    constructor(public Key?: K, public Value?: V) {

    }
}