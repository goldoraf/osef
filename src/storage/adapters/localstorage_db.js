import AbstractDb from './abstract_db';

class LocalstorageDb extends AbstractDb {
    put(key, value) {
        localStorage.setItem(this.prefix(key), JSON.stringify(value));
    }

    get(key) {
        return JSON.parse(localStorage.getItem(this.prefix(key)));
    }

    exists(key) {
        return localStorage.getItem(this.prefix(key)) !== null;
    }

    del(key) {
        return localStorage.removeItem(this.prefix(key));
    }

    prefix(key) {
        return this.namespace === null ? key : this.namespace + ':' + key;
    }
}

export default LocalstorageDb;