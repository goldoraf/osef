var assert = chai.assert,
    event = { data: 42 },
    EventBus = Osef.wires.EventBus;

describe('EventBus', function() {
    
    beforeEach(function() {
        EventBus.unsuscribeAll();
    });

    describe('subscribe', function() {
        it('should register a callback function for a given event name', function(done) {
            var callback = sinon.spy();
            EventBus.subscribe('foo', callback);
            EventBus.publish('foo', event);
            assert(callback.called);
            done();
        });

        it('should allow to subscribe a given callback function to many events', function(done) {
            var callback = sinon.spy();
            EventBus.subscribe('foo', callback);
            EventBus.subscribe('bar', callback);
            EventBus.publish('foo', event);
            assert(callback.calledOnce);
            EventBus.publish('bar', event);
            assert(callback.calledTwice);
            done();
        });

        it('should return a token for later unsuscribe', function() {
            assert.ok(typeof EventBus.subscribe('foo', function() {}) == 'string');
        });

        it('should support hierarchical addressing', function(done) {
            var callback = sinon.spy();
            EventBus.subscribe('foo', callback);
            EventBus.publish('foo.bar', event);
            EventBus.publish('foo.baz', event);
            assert(callback.calledTwice);
            done();
        });

        it('should accept a context for the callback function', function(done) {
            var dummy = {
                foo: 'bar',
                created: function(msg, data) {
                    assert.equal('bar', this.foo);
                }
            };
            EventBus.subscribe('foo', dummy.created, dummy);
            EventBus.publish('foo', event);
            done();
        });

        it('should accept wildcards in event names', function(done) {
            var handler = {
                handle: function(msg, data) {}
            };
            var spy = sinon.spy(handler, 'handle');
            EventBus.subscribe('foo.test-*', handler.handle);
            EventBus.publish('foo.test-123.dummyCreated', event);
            assert(spy.calledOnce);
            assert(spy.calledWith('foo.test-123.dummyCreated'));
            done();
        });
    });

    describe('publish', function() {
        it('should pass the event name and the event\'s data to the subscribed handler', function(done) {
            var callback = sinon.spy();
            EventBus.subscribe('bar', callback);
            EventBus.publish('bar', event);
            assert(callback.calledWith('bar', event));
            done();
        });

        it('should return false if there is no subscribers to the message', function(done) {
            assert.notOk(EventBus.publish('foo', event));
            EventBus.subscribe('foo', function() {});
            assert.ok(EventBus.publish('foo', event));
            done();
        });
    });

    describe('unsuscribe', function() {
        it('should accept a token and cancel a specific subscription', function(done) {
            var callback = sinon.spy(),
                token1 = EventBus.subscribe('foo', callback),
                token2 = EventBus.subscribe('bar', callback);
            EventBus.unsubscribe(token1);
            EventBus.publish('foo', event);
            assert(!callback.called);
            EventBus.publish('bar', event);
            assert(callback.called);
            done();
        });

        it('should accept a callback and cancel all its subscriptions', function(done) {
            var callback = sinon.spy();
            EventBus.subscribe('foo', callback);
            EventBus.subscribe('bar', callback);
            EventBus.unsubscribe(callback);
            EventBus.publish('foo', event);
            EventBus.publish('bar', event);
            assert(!callback.called);
            done();
        });
    });

    describe('unsuscribeAll', function() {
        it('should unsuscribe everything', function(done) {
            var cb1 = sinon.spy(), cb2 = sinon.spy();
            EventBus.subscribe('foo', cb1);
            EventBus.subscribe('foo', cb2);
            EventBus.subscribe('bar', cb1);
            EventBus.unsuscribeAll();
            EventBus.publish('foo', event);
            EventBus.publish('bar', event);
            assert(!cb1.called);
            assert(!cb2.called);
            done();
        });
    });
});