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

    add(key, mutateLambda) {
        return this.store.put(key, mutateLambda(this.initialState));
    }

    update(key, mutateLambda) {
        var that = this;
        return this.get(key).then(function(currentState) {
            return that.save(key, mutateLambda(currentState));
        });
    }

    addOrUpdate(key, mutateLambda) {
        var that = this;
        return this.getOrCreate(key).then(function(currentState) {
            return that.save(key, mutateLambda(currentState));
        });
    }

    get(key) {
        return this.store.get(key);
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

    save(key, newState) {
        return this.store.put(key, newState).then(function() {
            EventBus.publish('projections.' + key + '.changed', newState);
        });
    }
}

export default Projection;