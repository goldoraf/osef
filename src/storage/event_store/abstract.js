class AbstractEventStoreAdapter {
    constructor(namespace) {
        this.namespace = namespace;
    }

    append(streamId, expectedVersion, event) {
        throw new Error('Not implemented');
    }

    read(streamId, skipEvents, maxCount) {
        throw new Error('Not implemented');
    }
}

export default AbstractEventStoreAdapter;