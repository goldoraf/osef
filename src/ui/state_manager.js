class StateManager {
    constructor() {
        this.states = [];
        this.default = null;
    }

    addState(path, cb) {
        var params = [];
        path = path.replace(/(\?)?\{([^}]+)\}/g, function(match, optional, param) {
            params.push({ name: param, optional: (optional == '?') ? true : false });
            return '([\\w-]+)?';
        });
        this.states.push({ regex: new RegExp(path), params: params, cb: cb });
    }

    defaultTo(state) {
        this.default = this.findState(state);
    }

    run() {
        this.transitionTo(location.hash);
        window.addEventListener("hashchange", this.hashChanged.bind(this), false);
    }

    hashChanged(event) {
        this.transitionTo(location.hash);
    }

    transitionTo(hash) {
        var state = (hash == '') ? this.default : this.findState(hash);
        var params = {},
            matched = hash.match(state.regex);
        for (var i in state.params) {
            var param = state.params[i];
            params[param.name] = matched[parseInt(i) + 1];
        }
        state.cb(params);
    }

    findState(hash) {
        for (var k in this.states) {
            var state = this.states[k],
                matched = hash.match(state.regex);
            if (matched) {
                return state;
            }
        }
    }
}

export default StateManager;