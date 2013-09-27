const { Projection } = Osef.domain;

class ContactListProjection extends Projection {
    constructor(store) {
        super(store);
        this.key = 'contact-list';
        this.initialState = new ContactList();
    }

    contactCreated(e) {
        return this.addOrUpdate(this.key, function(s) {
            s.addContact(e.name);
            return s;
        });
    }
}

class ContactList {
    constructor() {
        this.contacts = [];
    }

    addContact(name) {
        this.contacts.push(name);
    }
}

export default ContactListProjection;