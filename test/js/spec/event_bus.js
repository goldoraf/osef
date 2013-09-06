var EventBus = Osef.domain.EventBus;

describe('EventBus tests', function() {
    it('should work ;)', function() {
        EventBus.subscribe('foo', function(e) {
            chai.assert.equal(e.data, 42);
        });
        EventBus.publish('foo', { data: 42 });
    });
});