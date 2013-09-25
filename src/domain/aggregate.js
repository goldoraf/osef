class Aggregate {
    constructor(identifier) {
        if (identifier === undefined) {
            identifier = generateUUID();
        }
        this.identifier = identifier;
        this.state = new AggregateState();
        this.changes = [];
    }

    apply(event) {
        this.state.mutate(event);
        this.changes.push(event);
    }

    toEvent(name, data) {
        return { 
            name: name,
            payload: data || {}
        };
    }

    getStreamId() {
        return this.getType().toLowerCase() + '-' + this.identifier;
    }

    getType() {
        throw new Error("You must implement the getType() method of aggregates for now");
    }
}

class AggregateState {
    mutate(event) {
        this[event.name](event.payload);
    }
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

export { Aggregate, AggregateState };