import AbstractEventStoreAdapter from './abstract';

class LocalstorageEventStoreAdapter extends AbstractEventStoreAdapter {
    constructor(namespace) {
        super(namespace);
        this.storage = window.localStorage;
    }

    append(streamId, expectedVersion, event) {
        var version = this.getCurrentVersion(streamId);
        if (version !== expectedVersion) {
            throw new Error("Concurrency error: the expected version of the aggregate is not the same as the stored one");
        }

        version++;
        this.storage.setItem(this.getKey(streamId, version), JSON.stringify(event));
        this.setVersion(streamId, version);
    }

    read(streamId, afterVersion, maxCount) {
        afterVersion = afterVersion || 0;
        maxCount = maxCount || this.getCurrentVersion(streamId) - afterVersion;
        var i, data = [], minVersion = afterVersion + 1, maxVersion = afterVersion + maxCount;
        for (i = minVersion; i <= maxVersion; i++) {
            data.push(JSON.parse(this.storage.getItem(this.getKey(streamId, i))));
        }
        return data;
    }

    getKey(streamId, version) {
        return this.namespace + ':' + streamId + ':' + version;
    }

    setVersion(streamId, version) {
        this.storage.setItem(this.getKey(streamId, '__version__'), version.toString());
    }

    getCurrentVersion(streamId) {
        var version = this.storage.getItem(this.getKey(streamId, '__version__'));
        if (version === null || version === undefined) {
            return 0;
        }
        return parseInt(version, 10);
    }
}

export default LocalstorageEventStoreAdapter;