import { EventBus } from '../wires/event_bus';

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
            EventBus.publish('domain.'+streamId+'.'+event.name, event);
            expectedVersion++;
        }, this);
    }

    loadEventStream(streamId) {
        var version = 0,
            events = [],
            records = this.readEventStream(streamId, 0, null);

        records.forEach(function(r) {
            version = r.version;
            events.push(r.data);
        });
        return new EventStream(streamId, events, version);
    }

    readEventStream(streamId, skipEvents, maxCount) {
        return this.adapter.read(streamId, skipEvents, maxCount);
    }
}

class EventStream {
    constructor(streamId, events, version) {
        this.streamId = streamId;
        this.events = events;
        this.version = version;
    }
}

export { EventStore, EventStream };