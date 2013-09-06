import LocalstorageDb from './adapters/localstorage_db';

var Db = {
    open: function(namespace) {
        return new LocalstorageDb(namespace);
    }
};

export { Db, LocalstorageDb };