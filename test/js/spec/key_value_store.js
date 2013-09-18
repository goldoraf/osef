describe('KeyValueStore', function() {
    
    var assert = chai.assert;
        assert.promise = function(obj) {
            return this.ok(obj.hasOwnProperty('then'));
        };

    ['IndexedDb', 'Localstorage'].forEach(function(adapter) {
        var klass = adapter + 'KeyValueStore',
            store = new Osef.storage[klass]('test:contacts');
        
        beforeEach(function() {
            if (adapter == 'Localstorage') {
                localStorage.clear();
            } else {
                store.clear();
            }
        });

        describe(adapter + 'KeyValueStore', function() {

            describe('put', function() {
                it('returns a promise', function() {
                    assert.promise(store.put(1234, { foo: 'bar'}));
                });

                it('sets a value in the store', function(done) {
                    store.put(1234, { foo: 'bar'})
                      .then(function() {
                          store.get(1234)
                            .then(function(value) {
                                assert.equal(value.foo, 'bar');
                                done();
                            });
                      });
                });
            });

            describe('get', function() {
                it('returns a promise', function() {
                    assert.promise(store.get(1234));
                });
            });

            describe('exists', function() {
                it('returns a promise', function() {
                    assert.promise(store.exists(1234));
                });

                it('returns false if a key doesn\'t exist', function(done) {
                    store.exists(1234)
                      .then(function(value) {
                          assert.equal(value, false);
                          done();
                      });
                });

                it('returns true if a key exists', function(done) {
                    store.put(1234, { foo: 'bar'})
                      .then(function() {
                          store.exists(1234)
                            .then(function(value) {
                                assert.equal(value, true);
                                done();
                            });
                      });
                });
            });

            describe('del', function() {
                it('returns a promise', function() {
                    assert.promise(store.del(1234));
                });

                it('deletes a key when it exists', function(done) {
                    store.put(1234, { foo: 'bar'})
                      .then(function() {
                          store.del(1234)
                            .then(function() {
                                assert.ok(true);
                                done();
                            });
                      });
                });
            });
        });
    });
});