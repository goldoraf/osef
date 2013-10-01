import { EventBus } from '../wires/event_bus';

class Projection {
    constructor(store) {
        this.store = store;
        this.initialState = {};
    }

    project(event) {
        var eventHandler = event.name;
        if (typeof this[eventHandler] === 'function') {
            this[eventHandler](event.payload);
        }
    }

    addOrUpdate(key, mutateLambda) {
        var that = this;
        return this.getOrCreate(key).then(function(currentState) {
            return that.update(key, mutateLambda(currentState));
        });
    }

    getOrCreate(key) {
        var that = this;
        return this.store.exists(key).then(function(exists) {
            if (exists) return that.store.get(key);
            return that.create(key);
        });
    }

    create(key) {
        var state = this.initialState;
        return this.store.put(key, state).then(function() {
            return when.resolve(state);
        });
    }

    update(key, newState) {
        return this.store.put(key, newState).then(function() {
            EventBus.publish('projections.' + key + '.changed', newState);
        });
    }
}

export default Projection;