/**
 * IndexedDB wrapper for style cards cache persistence
 * Provides fast, versioned caching of style cards data in the browser
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
	formatError,
} from '@extensions/common/indexedDBManager';

const STORE_NAME = STORE_NAMES.styleCards;
const CALLER_NAME = 'styleCardsCacheDB';

/**
 * Save style cards cache to IndexedDB
 *
 * @param {Object} styleCards Style cards object
 * @param {string} hash       Server hash for cache validation
 * @returns {Promise<void>}
 */
export const saveToIndexedDB = async (styleCards, hash) => {
	try {
		const db = await openDB(CALLER_NAME);
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);

		const data = {
			key: 'styleCardsCache',
			styleCards,
			hash,
			timestamp: Date.now(),
		};

		store.put(data);

		return executeTransaction(transaction, db, CALLER_NAME, 'save cache');
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn(
			`[${CALLER_NAME}] Error saving to IndexedDB:`,
			formatError(error)
		);
		throw error;
	}
};

/**
 * Load style cards cache from IndexedDB
 *
 * @returns {Promise<{styleCards: Object, hash: string, timestamp: number}|null>} Cached data or null
 */
export const loadFromIndexedDB = async () => {
	try {
		const db = await openDB(CALLER_NAME);
		const transaction = db.transaction([STORE_NAME], 'readonly');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.get('styleCardsCache');

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
			formatError(error)
		);
		return null;
	}
};

/**
 * Clear style cards cache from IndexedDB
 * Useful for manual cache invalidation or debugging
 *
 * @returns {Promise<void>}
 */
export const clearIndexedDB = async () => {
	try {
		const db = await openDB(CALLER_NAME);
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);

		store.delete('styleCardsCache');

		return executeTransaction(transaction, db, CALLER_NAME, 'clear cache');
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn(
			`[${CALLER_NAME}] Error clearing IndexedDB:`,
			formatError(error)
		);
		throw error;
	}
};
