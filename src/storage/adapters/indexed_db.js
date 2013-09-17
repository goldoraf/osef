import AbstractDb from './abstract_db';

var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
    IDBDatabase = window.IDBDatabase || window.webkitIDBDatabase,
    IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
    IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

class IndexedDb extends AbstractDb {
    constructor(namespace) {
        super(namespace);
        var parts = namespace.split(':');
        this.dbName = parts[0];
        this.storeName = parts[1];
        this.key = 'id';
        this.connected = false;
        this.db = null;
    }

    put(key, value) {
        if (!value.hasOwnProperty(this.key)) {
            value[this.key] = key;
        }

        var that = this;
        return this.getStore()
                   .then(function(store) {
                        return that.toPromise(store.add(value));
                   });
    }

    get(key) {
        var that = this;
        return this.getStore()
                   .then(function(store) {
                        return that.toPromise(store.get(key));
                   });
    }

    exists(key) {
        var that = this;
        return this.getStore()
                   .then(function(store) {
                        return that.toPromise(store.count(key));
                   })
                   .then(function(value) {
                        return when.resolve(value === 1);
                   });
    }

    del(key) {
        var that = this;
        return this.getStore()
                   .then(function(store) {
                        return that.toPromise(store.delete(key));
                   });
    }

    clear() {
        var that = this;
        return this.getStore()
                   .then(function(store) {
                        return that.toPromise(store.clear());
                   });
    }

    toPromise(request) {
        var deferred = when.defer();
        request.onsuccess = function(e) {
            deferred.resolve(this.result);
        };
        request.onerror = function(e) {
            // TODO: return an error message
            deferred.reject(new Error());
        };
        return deferred.promise;
    }

    getStore() {
        var storeName = this.storeName;
        return this.connect()
                   .then(function(db) {
                        var transaction = db.transaction([storeName], "readwrite");
                        transaction.oncomplete = function(e) {
                            // TODO...
                        };
                        transaction.onerror = function(e) {
                            // TODO...
                        };
                        return when.resolve(transaction.objectStore(storeName));
                   });
    }

    connect() {
        if (this.connected) {
            return when.resolve(this.db);
        }
        var that = this;
        return this.open()
                   .then(function(db) { 
                        return that.upgradeIfNeeded(db); 
                    })
                   .then(function(db) {
                        that.db = db;
                        that.connected = true;
                        return when.resolve(db);
                   });
    }

    open(version, createStore) {
        var deferred = when.defer(),
            request = version ? indexedDB.open(this.dbName, version) : indexedDB.open(this.dbName);
        
        request.onsuccess = function(e) {
            deferred.resolve(this.result);
        };
        request.onerror = function(e) {
            deferred.reject(new Error("Can't open indexedDb"));
        };
        if (createStore) {
            var storeName = this.storeName,
                key = this.key;
            
            request.onupgradeneeded = function(e) {
                this.result.createObjectStore(storeName, { keyPath: key });
            };
        }
        return deferred.promise;
    }

    upgradeIfNeeded(db) {
        if (!db.objectStoreNames.contains(this.storeName)) {
            var version = db.version + 1;
            db.close();
            return this.open(version, true);
        }
        return when.resolve(db);
    }
}

export default IndexedDb;