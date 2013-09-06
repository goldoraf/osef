class AbstractDb {
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
}

export default AbstractDb;