class ViewContext {
    constructor(state) {
        this.state = state;
        this.changeHandlers = [];
    }

    changed(newState) {
        this.state = newState;
        this.changeHandlers.forEach(function(handler) {
            handler();
        }, this);
    }

    onChange(handler) {
        this.changeHandlers.push(handler);
    }
}

export default ViewContext;