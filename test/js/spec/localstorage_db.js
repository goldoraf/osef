describe('LocalstorageDb tests', function() {
    var db = new Osef.storage.LocalstorageDb('test');

    beforeEach(function() {
        localStorage.clear();
    });

    it('should save a key\'s value', function() {
        db.put('foo', 'bar');
        chai.assert.equal(JSON.parse(localStorage.getItem('test:foo')), 'bar');
    });

    it('should fetch a value', function() {
        db.put('foo', 'bar');
        chai.assert.equal(db.get('foo'), 'bar');
    });

    it('should know if a key exists', function() {
        chai.assert.notOk(db.exists('foo'));
        db.put('foo', 'bar');
        chai.assert.ok(db.exists('foo'));
    });

    it('should delete a key', function() {
        db.put('foo', 'bar');
        db.del('foo');
        chai.assert.notOk(db.exists('foo'));
    });
});