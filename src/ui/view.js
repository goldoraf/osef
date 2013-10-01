import { EventBus } from '../wires/event_bus';

var eventSplitter = /^(\S+)\s*(.*)$/;

class View {
    constructor(context) {
        this.templateName = null;
        this.template = null;
        this.element = null;
        this.context = null;
        this.events = {};

        this.createElement();
        
        if (context) {
            this.setContext(context);
        }
    }

    setContext(context) {
        this.context = context;
    }

    contextChanged() {
        this.rerender();
    }

    rerender() {
        this.detachEvents();
        this.render();
    }

    render() {
        if (this.template === null) {
            this.template = this.getTemplateFromName();
        }
        this.element.innerHTML = this.template(this.context);
        this.attachEvents();
        return this;
    }

    createElement() {
        this.element = document.createElement('div');
    }

    remove() {
        this.detachEvents();
        this.element.parentNode.removeChild(this.element);
    }

    append() {
        this.appendTo(document.body);
    }

    appendTo(elt) {
        elt.appendChild(this.element);
    }

    attachEvents() {
        for (var key in this.events) {
            var match = key.match(eventSplitter),
                eventName = match[1], selector = match[2],
                fn = this.events[key];

            this.$(selector).addEventListener(eventName, this[fn].bind(this), false);
        }
    }

    detachEvents() {
        // TODO
    }

    trigger(eventName, data) {
        EventBus.publish(eventName, data);
    }

    $(selector) {
        return this.element.querySelector(selector);
    }

    getTemplateFromName() {
        return JST[this.templateName];
    }
}

export default View;