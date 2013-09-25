describe('EventStore', function() {
    afterEach(function() {
        localStorage.clear();
    });

    var assert = chai.assert,
        adapter = new Osef.storage.LocalstorageEventStoreAdapter('test'),
        store = new Osef.storage.EventStore(adapter),
        bus = Osef.wires.EventBus;

    describe('appendToStream', function() {
        it('should publish each event on the EventBus', function(done) {
            bus.subscribe('domain.test-123.dummyCreated', function(e) {
                assert(true);
                done();
            });
            store.appendToStream('test-123', 0, [{ name: 'dummyCreated', payload: { foo: 'bar' } }]);
        });
    });

    describe('loadEventStream', function() {
        it('should return an EventStream object', function() {
            var stream = store.loadEventStream('test-123');
            assert(stream instanceof Osef.storage.EventStream);
        });

        it('should contain a version number and an array of events', function() {
            store.appendToStream('test-123', 0, [
                { name: 'dummyCreated', payload: { foo: 'bar' } },
                { name: 'dummyCreated', payload: { john: 'doe' } }
            ]);
            var stream = store.loadEventStream('test-123');
            assert.equal(stream.version, 2);
            assert.equal(stream.events.length, 2);
        });
    });
});