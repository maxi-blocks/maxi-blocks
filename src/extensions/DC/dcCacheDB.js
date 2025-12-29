/**
 * IndexedDB wrapper for Dynamic Content cache persistence
 * Stores cached entities keyed by request hash
 */

import {
	openDB,
	executeTransaction,
	STORE_NAMES,
} from '@extensions/common/indexedDBManager';

const STORE_NAME = STORE_NAMES.dynamicContent;
const CALLER_NAME = 'dcCacheDB';

export const DEFAULT_TTL = 5 * 60 * 1000;

const sortObjectKeys = value => {
	if (Array.isArray(value)) {
		return value.map(sortObjectKeys);
	}
	if (value && typeof value === 'object') {
		return Object.keys(value)
			.sort()
			.reduce((acc, key) => {
				acc[key] = sortObjectKeys(value[key]);
				return acc;
			}, {});
	}
	return value;
};

export const createCacheKey = (namespace, request) => {
	const normalizedRequest = sortObjectKeys(request);
	return `${namespace}:${JSON.stringify(normalizedRequest)}`;
};

export const saveToCache = async (key, data, ttl = DEFAULT_TTL) => {
	try {
		const db = await openDB(CALLER_NAME);
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);

		const cacheData = {
			key,
			data,
			timestamp: Date.now(),
			ttl,
		};

		store.put(cacheData);

		return executeTransaction(
			transaction,
			db,
			CALLER_NAME,
			'save cache'
		).catch(() => null);
	} catch (error) {
		return null;
	}
};

export const loadFromCache = async key => {
	try {
		const db = await openDB(CALLER_NAME);
		const transaction = db.transaction([STORE_NAME], 'readonly');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.get(key);

		return new Promise(resolve => {
			request.onsuccess = () => {
				db.close();
				const { result } = request;
				if (!result) {
					resolve(null);
					return;
				}

				const age = Date.now() - result.timestamp;
				if (age > result.ttl) {
					resolve(null);
					return;
				}

				resolve(result);
			};

			request.onerror = () => {
				db.close();
				resolve(null);
			};
		});
	} catch (error) {
		return null;
	}
};

export const cleanupExpiredCache = async () => {
	try {
		const db = await openDB(CALLER_NAME);
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.openCursor();
		const now = Date.now();

		request.onsuccess = event => {
			const cursor = event.target.result;
			if (cursor) {
				const age = now - cursor.value.timestamp;
				if (age > cursor.value.ttl) {
					cursor.delete();
				}
				cursor.continue();
			}
		};

		return executeTransaction(
			transaction,
			db,
			CALLER_NAME,
			'cleanup expired cache'
		).catch(() => null);
	} catch (error) {
		return null;
	}
};
