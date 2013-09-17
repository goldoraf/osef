describe('Db', function() {
    
    var assert = chai.assert;
        assert.promise = function(obj) {
            return this.ok(obj.hasOwnProperty('then'));
        };

    ['Indexed', 'Localstorage'].forEach(function(adapter) {
        var klass = adapter + 'Db',
            db = new Osef.storage[klass]('test:contacts');
        
        beforeEach(function() {
            if (adapter == 'Localstorage') {
                localStorage.clear();
            } else {
                db.clear();
            }
        });

        describe(adapter + 'Db', function() {

            describe('put', function() {
                it('returns a promise', function() {
                    assert.promise(db.put(1234, { foo: 'bar'}));
                });

                it('sets a value in the db', function(done) {
                    db.put(1234, { foo: 'bar'})
                      .then(function() {
                          db.get(1234)
                            .then(function(value) {
                                assert.equal(value.foo, 'bar');
                                done();
                            });
                      });
                });
            });

            describe('get', function() {
                it('returns a promise', function() {
                    assert.promise(db.get(1234));
                });
            });

            describe('exists', function() {
                it('returns a promise', function() {
                    assert.promise(db.exists(1234));
                });

                it('returns false if a key doesn\'t exist', function(done) {
                    db.exists(1234)
                      .then(function(value) {
                          assert.equal(value, false);
                          done();
                      });
                });

                it('returns true if a key exists', function(done) {
                    db.put(1234, { foo: 'bar'})
                      .then(function() {
                          db.exists(1234)
                            .then(function(value) {
                                assert.equal(value, true);
                                done();
                            });
                      });
                });
            });

            describe('del', function() {
                it('returns a promise', function() {
                    assert.promise(db.del(1234));
                });

                it('deletes a key when it exists', function(done) {
                    db.put(1234, { foo: 'bar'})
                      .then(function() {
                          db.del(1234)
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