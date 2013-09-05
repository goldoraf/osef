class Aggregate {
    constructor(identifier) {
        if (identifier === undefined) {
            this.identifier = generateUUID();
        }
        this.version = 0;
        this.uncommittedEvents = [];
    }

    // should return a JSON object describing the state of the aggregate
    snapshot() {
        throw new Error("Not implemented");
    }

    toEvent(name, data) {
        var event = { 
            event: name,
            type: 'domain',
            payload: data || {}
        };

        if (!event.payload.id) {
            event.payload.id = this.identifier;
        }

        return event;
    }

    loadFromHistory(events) {
        events.forEach(function(e) {
            if (e.type == 'snapshot') {
                this.applySnapshot(e);
            } else {
                this.applyEvent(e);
            }
        }, this);
    }

    // should restore the state of the aggregate from the payload's JSON
    applySnapshot(event) {
        throw new Error("Not implemented");
    }

    applyEvent(event) {
        this[event.event](event.payload);
        if (event.head && this.version < event.head.revision) { // on est en train de faire un replay...
            this.version = event.head.revision;
        } else {
            event.head = { revision: ++this.version };
            this.uncommittedEvents.push(event);
        }
    }

    getType() {
        throw new Error("You must implement the getType() method of aggregates for now");
    }
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

export default Aggregate;