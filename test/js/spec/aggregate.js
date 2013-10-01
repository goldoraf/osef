describe('Aggregate tests', function() {
    var assert = chai.assert;

    it('should get an UUID when instantiated', function() {
        var contact = new Tests.Contact();
        assert(contact.identifier !== null);
        assert.equal(36, contact.identifier.length);
    });

    describe('apply', function() {
        it('should mutate the aggregate state', function() {
            var contact = new Tests.Contact(),
                spy = sinon.spy(contact.state, 'mutate'),
                event = { name: 'contactCreated', payload: { name: 'John Doe' } };

            contact.apply(event);
            assert(spy.calledWith(event));
        });

        it('should append the event to the aggregate\'s changes property', function() {
            var contact = new Tests.Contact(),
                event = { name: 'contactCreated', payload: { name: 'John Doe' } };

            assert(contact.changes.length === 0);
            contact.apply(event);
            assert(contact.changes.length === 1);
            assert.deepEqual(event, contact.changes[0]);
        });
    });
});