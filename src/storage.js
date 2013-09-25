import { KeyValueStore, LocalstorageKeyValueStore, IndexedDbKeyValueStore } from './storage/key_value_store';
import { EventStore, EventStream } from './storage/event_store';
import LocalstorageEventStoreAdapter from './storage/event_store/localstorage';

export { EventStore, EventStream, LocalstorageEventStoreAdapter, KeyValueStore, LocalstorageKeyValueStore, IndexedDbKeyValueStore };