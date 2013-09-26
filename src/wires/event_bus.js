
var EventBus = {
    messages: {},
    wildcards: [],
    uuid: 0,

    subscribe: function(message, callback, context) {
        if (!this.messages.hasOwnProperty(message)) {
            this.messages[message] = [];
        }
        var token = String(++this.uuid);
        this.messages[message].push({ token: token, callback: callback, context: context });
        if (this.containsWildcards(message)) {
            this.addWildcard(message);
        }
        return token;
    },

    publish: function(message, data) {
        var matchedWildcards = this.matchWildcards(message);
        matchedWildcards.forEach(function(wildcardedMessage) {
            this.deliverMessage(message, wildcardedMessage, data);
        }, this);

        if (!this.hasSubscribers(message) && matchedWildcards.length === 0) {
            return false;
        }
        this.deliverNamespaced(message, data);
        return true;
    },

    hasSubscribers: function(message) {
        var topic = String(message),
            found = this.messages.hasOwnProperty(topic),
            position = topic.lastIndexOf('.');

        while (!found && position !== -1) {
            topic = topic.substr(0, position);
            position = topic.lastIndexOf('.');
            found = this.messages.hasOwnProperty(topic);
        }

        return found && this.messages[topic].length > 0;
    },

    deliverNamespaced: function(message, data) {
        var topic = String(message),
            position = topic.lastIndexOf('.');

            this.deliverMessage(message, message, data);

            while (position !== -1) {
                topic = topic.substr(0, position);
                position = topic.lastIndexOf('.');
                this.deliverMessage(message, topic, data);
            }
    },

    deliverMessage: function(originalMessage, matchedMessage, data) {
        if (!this.messages.hasOwnProperty(matchedMessage)) {
            return;
        }

        var i, subscribers = this.messages[matchedMessage];

        // do not cache the length of the subscribers array, 
        // as it might change if there are unsubscribtions during delivery of a message
        for (i = 0; i < subscribers.length; i++) {
            this.callSubscriber(subscribers[i], originalMessage, data);
        }
    },

    callSubscriber: function(subscriber, message, data) {
        if (subscriber.context !== undefined) {
            subscriber.callback.call(subscriber.context, message, data);
        } else {
            subscriber.callback(message, data);
        }
    },

    containsWildcards: function(message) {
        return message.indexOf('*') !== -1;
    },

    addWildcard: function(message) {
        this.wildcards.push({ regex: message.replace(/(\*)/, '([\\w-]+)'), message: message });
    },

    matchWildcards: function(message) {
        var messages = [];
        this.wildcards.forEach(function(wildcard) {
            if (message.match(wildcard.regex)) {
                messages.push(wildcard.message);
            }
        });
        return messages;
    },

    unsubscribe: function(tokenOrCallback) {
        var isToken = typeof tokenOrCallback === 'string',
            property = isToken ? 'token' : 'callback',
            result = false,
            m, i;

        for (var m in this.messages) {
            if (this.messages.hasOwnProperty(m)) {
                for (i = this.messages[m].length - 1 ; i >= 0; i--) {
                    if (this.messages[m][i][property] === tokenOrCallback) {
                        this.messages[m].splice(i, 1);
                        if (isToken) {
                            return true;
                        }
                        result = true;
                    }
                }
            }
        }
        return result;
    },

    unsuscribeAll: function() {
        this.messages = {};
    }
};

export { EventBus };