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

const DB_NAME = 'maxiBlocksCache';
const DB_VERSION = 2; // Same version as uniqueIDs cache
const STORE_NAME = 'styleCards';

/**
 * Open IndexedDB connection
 *
 * @returns {Promise<IDBDatabase>} Database connection
 */
const openDB = () => {
	return new Promise((resolve, reject) => {
		// Check if IndexedDB is available
		if (!window.indexedDB) {
			// eslint-disable-next-line no-console
			console.warn(
				'[styleCardsCacheDB] IndexedDB not available, falling back to memory cache'
			);
			reject(new Error('IndexedDB not available'));
			return;
		}

		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => {
			// eslint-disable-next-line no-console
			console.warn(
				'[styleCardsCacheDB] Failed to open database:',
				JSON.stringify(request.error)
			);
			reject(request.error);
		};

		request.onsuccess = () => {
			resolve(request.result);
		};

		request.onupgradeneeded = event => {
			const db = event.target.result;

			// Create all required object stores (shared database with other cache modules)
			if (!db.objectStoreNames.contains('uniqueIDs')) {
				db.createObjectStore('uniqueIDs', { keyPath: 'key' });
			}
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: 'key' });
			}
			if (!db.objectStoreNames.contains('wordPressAPI')) {
				db.createObjectStore('wordPressAPI', { keyPath: 'key' });
			}
		};
	});
};

/**
 * Save style cards cache to IndexedDB
 *
 * @param {Object} styleCards Style cards object
 * @param {string} hash       Server hash for cache validation
 * @returns {Promise<void>}
 */
export const saveToIndexedDB = async (styleCards, hash) => {
	try {
		const db = await openDB();
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);

		const data = {
			key: 'styleCardsCache',
			styleCards,
			hash,
			timestamp: Date.now(),
		};

		store.put(data);

		return new Promise((resolve, reject) => {
			transaction.oncomplete = () => {
				db.close();
				resolve();
			};

			transaction.onerror = () => {
				db.close();
				// eslint-disable-next-line no-console
				console.warn(
					'[styleCardsCacheDB] Failed to save cache:',
					JSON.stringify(transaction.error)
				);
				reject(transaction.error);
			};
		});
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn(
			'[styleCardsCacheDB] Error saving to IndexedDB:',
			JSON.stringify(error)
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
		const db = await openDB();
		const transaction = db.transaction([STORE_NAME], 'readonly');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.get('styleCardsCache');

		return new Promise((resolve, reject) => {
			request.onsuccess = () => {
				db.close();
				const { result } = request;

				resolve(result || null);
			};

			request.onerror = () => {
				db.close();
				// eslint-disable-next-line no-console
				console.warn(
					'[styleCardsCacheDB] Failed to load cache:',
					JSON.stringify(request.error)
				);
				reject(request.error);
			};
		});
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn(
			'[styleCardsCacheDB] Error loading from IndexedDB:',
			JSON.stringify(error)
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
		const db = await openDB();
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);

		store.delete('styleCardsCache');

		return new Promise((resolve, reject) => {
			transaction.oncomplete = () => {
				db.close();
				resolve();
			};

			transaction.onerror = () => {
				db.close();
				// eslint-disable-next-line no-console
				console.warn(
					'[styleCardsCacheDB] Failed to clear cache:',
					JSON.stringify(transaction.error)
				);
				reject(transaction.error);
			};
		});
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn(
			'[styleCardsCacheDB] Error clearing IndexedDB:',
			JSON.stringify(error)
		);
		throw error;
	}
};
