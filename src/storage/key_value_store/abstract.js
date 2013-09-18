class AbstractKeyValueStore {
    constructor(namespace) {
        this.namespace = namespace;
    }

    put(key, value) {
        throw new Error('Not implemented');
    }

    get(key) {
        throw new Error('Not implemented');
    }

    del(key) {
        throw new Error('Not implemented');
    }

    exists(key) {
        throw new Error('Not implemented');
    }

    clear() {
        throw new Error('Not implemented');
    }

    serialize(value) {
        return JSON.stringify(value);
    }

    deserialize(value) {
        if (typeof value != 'string') { 
            return undefined;
        }
        try { 
            return JSON.parse(value);
        } catch(e) { 
            return value || undefined;
        }
    }
}

export default AbstractKeyValueStore;