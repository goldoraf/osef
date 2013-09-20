import LocalstorageEventStoreAdapter from './event_store/localstorage';

class EventStore {
    constructor(storeAdapter) {
        this.adapter = storeAdapter;
    }

    appendToStream(streamId, expectedVersion, events) {
        if (events.length === 0) {
            return;
        }
        events.forEach(function(event) {
            this.adapter.append(streamId, expectedVersion, event);

            //EventBus.publish(streamCategory, event);
        }, this);
    }

    loadEventStream(streamId) {
        return this.readEventStream(streamId, 0, null);
    }

    readEventStream(streamId, skipEvents, maxCount) {
        return this.adapter.read(streamId, skipEvents, maxCount);
    }
}

export { EventStore, LocalstorageEventStoreAdapter };