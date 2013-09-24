function CustomEvent (event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
};
CustomEvent.prototype = window.CustomEvent.prototype;
window.CustomEvent = CustomEvent;

var EventBus = {
    subscribe: function(name, callback) {
        document.addEventListener(name, function(e) {
            callback(e.detail);
        });
    },

    publish: function(name, data) {
        var customEvent = new CustomEvent(name, { detail: data});
        document.dispatchEvent(customEvent);
    }
};

export { EventBus };