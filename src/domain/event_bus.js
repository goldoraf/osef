function CustomEvent (event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
};
CustomEvent.prototype = window.CustomEvent.prototype;
window.CustomEvent = CustomEvent;

var EventBus = {
    subscribe: function(stream, fn) {
        document.addEventListener(stream, function(e) {
            fn(e.detail);
        });
    },

    publish: function(stream, event) {
        var customEvent = new CustomEvent(stream, { detail: event});
        document.dispatchEvent(customEvent);
    }
};

export { EventBus };