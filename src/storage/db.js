import LocalstorageDb from './adapters/localstorage_db';
import IndexedDb from './adapters/indexed_db';

var Db = {
    open: function(namespace) {
        return new LocalstorageDb(namespace);
    }
};

export { Db, LocalstorageDb, IndexedDb };