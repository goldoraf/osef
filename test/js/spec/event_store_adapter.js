describe('LocalstorageEventStoreAdapter', function() {
    // Mandatory: Firefox doesn't allow to mock localStorage
    var lsmock = {
        values: {},
        getItem: function(key) {
            return this.values[key];
        },
        setItem: function(key, value) {
            this.values[key] = value;
        },
        clear: function() {
            this.values = {};
        }
    };
    
    var store = new Osef.storage.LocalstorageEventStoreAdapter('test');
    store.storage = lsmock;
    var assert = chai.assert,
        spy = sinon.spy(lsmock, 'setItem');

    afterEach(function() {
        lsmock.clear();
    });

    describe('append', function() {
        it('should store the data in localstorage along with its version number', function() {
            store.append('contact-123', 0, {foo: 'bar'});
            assert(spy.calledWith('test:contact-123:1', '{"data":{"foo":"bar"},"version":1}'));
        });

        it('should store the version number', function() {
            store.append('contact-123', 0, {foo: 'bar'});
            assert(spy.calledWith('test:contact-123:__version__', '1'));
        });

        it('should throw if there is a version conflict', function() {
            store.append('contact-123', 0, {foo: 'bar'});
            assert.throws(function() { store.append('contact-123', 2, {foo: 'bar'}) }, /Concurrency error/);
        });
    });

    describe('read', function() {
        beforeEach(function() {
            store.append('contact-123', 0, {foo: 'bar'});
            store.append('contact-123', 1, {hello: 'world'});
            store.append('contact-123', 2, {john: 'doe'});
        });

        it('should return all data records', function() {
            var records = store.read('contact-123');
            assert.equal(3, records.length);
            assert.deepEqual({hello: 'world'}, records[1].data);
        });

        it('should return data recorded after a specific version', function() {
            var records = store.read('contact-123', 2);
            assert.equal(1, records.length);
            assert.deepEqual({john: 'doe'}, records[0].data);
        });

        it('should return data recorded after a specific version with a limit count', function() {
            var records = store.read('contact-123', 1, 1);
            assert.equal(1, records.length);
            assert.deepEqual({hello: 'world'}, records[0].data);
        });
    });
});