import AbstractDb from './abstract_db';

class LocalstorageDb extends AbstractDb {
    put(key, value) {
        localStorage.setItem(this.prefix(key), this.serialize(value));
        return when.resolve(value);
    }

    get(key) {
        return when.resolve(this.deserialize(localStorage.getItem(this.prefix(key))));
    }

    exists(key) {
        return when.resolve(localStorage.getItem(this.prefix(key)) !== null);
    }

    del(key) {
        return when.resolve(localStorage.removeItem(this.prefix(key)));
    }

    prefix(key) {
        return this.namespace === null ? key : this.namespace + ':' + key;
    }
}

export default LocalstorageDb;