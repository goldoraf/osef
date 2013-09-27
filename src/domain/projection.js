class Projection {
    constructor(store) {
        this.store = store;
        this.initialState = {};
    }

    project(event) {
        var eventHandler = event.name;
        if (this.hasOwnProperty(eventHandler)) {
            this[eventHandler](event.payload);
        }
    }

    addOrUpdate(key, mutateLambda) {
        var that = this;
        return this.store.exists(key)
            .then(function(exists) {
                if (exists) return that.store.get(key);
                return when.resolve(that.initialState);
            })
            .then(function(currentState) {
                return that.store.put(key, mutateLambda(currentState));
            });
    }
}

export default Projection;