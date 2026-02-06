/**
 * IndexedDB wrapper for uniqueID cache persistence
 * Provides fast, versioned caching of uniqueID data in the browser
 *
 * Benefits:
 * - Survives page reloads and browser sessions
 * - Much larger storage capacity than localStorage (50MB+)
 * - Async operations don't block the main thread
 * - Automatic cache invalidation via hash comparison
 */

import {
	openDB,
	executeTransaction,
	executeRequest,
	STORE_NAMES,
} from '@extensions/common/indexedDBManager';

const STORE_NAME = STORE_NAMES.uniqueIDs;
const CALLER_NAME = 'uniqueIDCacheDB';

/**
 * Save uniqueID cache to IndexedDB
 *
 * @param {Array<string>} uniqueIDs Array of unique IDs
 * @param {string}        hash      Server hash for cache validation
 * @returns {Promise<void>}
 */
export const saveToIndexedDB = async (uniqueIDs, hash) => {
	try {
		const db = await openDB(CALLER_NAME);
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);

		const data = {
			key: 'uniqueIDCache',
			uniqueIDs,
			hash,
			timestamp: Date.now(),
		};

		store.put(data);

		return executeTransaction(transaction, db, CALLER_NAME, 'save cache');
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn(
			`[${CALLER_NAME}] Error saving to IndexedDB:`,
			error
		);
		throw error;
	}
};

/**
 * Load uniqueID cache from IndexedDB
 *
 * @returns {Promise<{uniqueIDs: Array<string>, hash: string, timestamp: number}|null>} Cached data or null
 */
export const loadFromIndexedDB = async () => {
	try {
		const db = await openDB(CALLER_NAME);
		const transaction = db.transaction([STORE_NAME], 'readonly');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.get('uniqueIDCache');

		const result = await executeRequest(
			request,
			db,
			CALLER_NAME,
			'load cache'
		);
		return result || null;
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn(
			`[${CALLER_NAME}] Error loading from IndexedDB:`,
			error
		);
		return null;
	}
};

/**
 * Clear uniqueID cache from IndexedDB
 * Useful for manual cache invalidation or debugging
 *
 * @returns {Promise<void>}
 */
export const clearIndexedDB = async () => {
	try {
		const db = await openDB(CALLER_NAME);
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);

		store.delete('uniqueIDCache');

		return executeTransaction(transaction, db, CALLER_NAME, 'clear cache');
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn(
			`[${CALLER_NAME}] Error clearing IndexedDB:`,
			error
		);
		throw error;
	}
};
