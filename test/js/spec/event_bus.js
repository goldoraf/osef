var EventBus = Osef.wires.EventBus;

describe('EventBus tests', function() {
    it('should work ;)', function(done) {
        EventBus.subscribe('foo', function(e) {
            chai.assert.equal(e.data, 42);
            done();
        });
        EventBus.publish('foo', { data: 42 });
    });
});