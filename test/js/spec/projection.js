var store = Osef.storage.KeyValueStore.open('test');

describe('Projection', function() {
    var assert = chai.assert;
        assert.promise = function(obj) {
            return this.ok(obj.hasOwnProperty('then'));
        };

    describe('project', function() {
        it('should call a method corresponding to the event\'s name and pass it the event\'s payload', function() {
            var event = { name: 'contactCreated', payload: { name: 'John Doe' } },
                proj = new Tests.ContactListProjection(store),
                spy = sinon.spy(proj, 'contactCreated');

            proj.project(event);
            assert(spy.calledOnce);
            assert(spy.calledWith(event.payload));
        });
    });

    describe('addOrUpdate', function() {
        var projKey = 'testproj-xxx',
            proj = new Osef.domain.Projection(store),
            dummyInitialState = { foo: 'bar' };

        beforeEach(function(done) {
            store.del(projKey).then(done);
        });

        it('should return a promise', function() {
            assert.promise(proj.addOrUpdate(projKey, function(s) { return null; }))
        });

        it('should pass the projection\'s initialState to the provided lambda when the document is not in the store yet', function(done) {
            proj.initialState = dummyInitialState;
            proj.addOrUpdate(projKey, function(s) {
                assert.deepEqual(dummyInitialState, s);
                done();
            });
        });

        it('should create the document in the store when it does not exists', function(done) {
            store.exists(projKey)
                .then(assert.notOk)
                .then(function() {
                    return proj.addOrUpdate(projKey, function(s) {
                        return { john: 'doe' };
                    });
                })
                .then(function() {
                    return store.exists(projKey);
                })
                .then(assert.ok)
                .then(done);
        });

        it('should pass the current state in the store to the provided lambda in the case of an update', function(done) {
            var simulatedState = { foo: 'baz' },
                lambda = sinon.spy();

            store.put(projKey, simulatedState)
                .then(function() {
                    return proj.addOrUpdate(projKey, lambda);
                })
                .then(function() {
                    assert(lambda.calledWith(simulatedState));
                    done();
                });
        });

        it('should update the document in the store', function(done) {
            var simulatedState = { foo: 'bat' },
                expectedState = { hello: 'world' };

            store.put(projKey, simulatedState)
                .then(function() {
                    return proj.addOrUpdate(projKey, function(s) {
                        return expectedState;
                    });
                })
                .then(function() {
                    return store.get(projKey);
                })
                .then(function(value) {
                    assert.deepEqual(expectedState, value);
                    done();
                });
            });
    });
});