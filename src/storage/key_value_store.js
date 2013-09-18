import LocalstorageKeyValueStore from './key_value_store/localstorage';
import IndexedDbKeyValueStore from './key_value_store/indexed_db';

var KeyValueStore = {
    open: function(namespace) {
        return new LocalstorageKeyValueStore(namespace);
    }
};

export { KeyValueStore, LocalstorageKeyValueStore, IndexedDbKeyValueStore };