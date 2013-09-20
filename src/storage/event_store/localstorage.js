import AbstractEventStoreAdapter from './abstract';

class LocalstorageEventStoreAdapter extends AbstractEventStoreAdapter {
    constructor(namespace) {
        super(namespace);
        this.storage = window.localStorage;
    }

    append(streamId, expectedVersion, event) {
        var version = expectedVersion + 1;
        this.storage.setItem(this.getKey(streamId, version), JSON.stringify(event));
        this.setVersion(streamId, version);
    }

    getKey(streamId, version) {
        return this.namespace + ':' + streamId + ':' + version;
    }

    setVersion(streamId, version) {
        this.storage.setItem(this.getKey(streamId, '__version__'), version.toString());
    }

    getCurrentVersion(streamId) {
        //return this.storage.getItem(this.getKey())
    }
}

export default LocalstorageEventStoreAdapter;