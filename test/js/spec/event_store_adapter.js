describe('LocalstorageEventStoreAdapter', function() {
    // Mandatory: Firefox doesn't allow to mock localStorage
    var lsmock = {
        getItem: function(key) {},
        setItem: function(key, value) {},
        clear: function() {}
    };
    
    var store = new Osef.storage.LocalstorageEventStoreAdapter('test');
    store.storage = lsmock;
    var spy = sinon.spy(lsmock, 'setItem');

    describe('append', function() {
        it('should store the data in localstorage', function() {
            store.append('contact-123', 0, {foo: 'bar'});
            chai.assert(spy.calledWith('test:contact-123:1', '{"foo":"bar"}'));
        });

        it('should store the version number', function() {
            store.append('contact-123', 0, {foo: 'bar'});
            chai.assert(spy.calledWith('test:contact-123:__version__', '1'));
        });
    });
});