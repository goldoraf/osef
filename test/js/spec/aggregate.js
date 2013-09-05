describe('Aggregate tests', function() {
    it('should get an UUID when instantiated', function() {
        var contact = new Tests.Contact();
        chai.assert(contact.identifier !== null);
        chai.assert.equal(contact.identifier.length, 36);
    });
});