const { Aggregate, AggregateState } = Osef.domain;

class Contact extends Aggregate {
    constructor(identifier) {
        super(identifier);
        this.state = new ContactState();
    }

    create(name) {
        this.apply(this.toEvent('contactCreated', { id: this.identifier, name: name }));
    }

    getType() {
        return 'Contact';
    }
}

class ContactState extends AggregateState {
    contactCreated(e) {
        this.id = e.id;
        this.name = e.name;
    }
}

export default Contact;