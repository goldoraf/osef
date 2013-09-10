describe('Db', function() {
    
    var assert = chai.assert;
        assert.promise = function(obj) {
            return this.ok(obj.hasOwnProperty('then'));
        };

    [/*'indexeddb', */'Localstorage'].forEach(function(adapter) {
        var klass = adapter + 'Db',
            db = new Osef.storage[klass]('test');
        
        beforeEach(function() {
            if (adapter == 'Localstorage') {
                localStorage.clear();
            }
        });

        describe(adapter + 'Db', function() {

            describe('put', function() {
                it('returns a promise', function() {
                    assert.promise(db.put('foo', 'bar'));
                });

                it('sets a value in the db', function(done) {
                    db.put('foo', 'bar')
                      .then(function() {
                          db.get('foo')
                            .then(function(value) {
                                assert.equal(value, 'bar');
                                done();
                            });
                      });
                });
            });

            describe('get', function() {
                it('returns a promise', function() {
                    assert.promise(db.get('foo'));
                });
            });

            describe('exists', function() {
                it('returns a promise', function() {
                    assert.promise(db.exists('foo'));
                });

                it('returns false if a key doesn\'t exist', function(done) {
                    db.exists('foo')
                      .then(function(value) {
                          assert.equal(value, false);
                          done();
                      });
                });

                it('returns true if a key exists', function(done) {
                    db.put('foo', 'bar')
                      .then(function() {
                          db.exists('foo')
                            .then(function(value) {
                                assert.equal(value, true);
                                done();
                            });
                      });
                });
            });

            describe('del', function() {
                it('returns a promise', function() {
                    assert.promise(db.del('foo'));
                });

                it('deletes a key when it exists', function(done) {
                    db.put('foo', 'bar')
                      .then(function() {
                          db.del('foo')
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