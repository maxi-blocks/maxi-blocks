/**
 * Shared IndexedDB manager for MaxiBlocks cache system
 * Centralizes database initialization and connection management
 * Used by uniqueIDCacheDB, styleCardsCacheDB, and wordPressAPICacheDB
 *
 * Benefits:
 * - DRY: Single source of truth for database configuration
 * - Consistent versioning across all cache modules
 * - Centralized error handling and logging
 * - Easy to add new object stores in the future
 */

/**
 * Database configuration constants
 */
export const DB_NAME = 'maxiBlocksCache';
export const DB_VERSION = 2;

/**
 * Object store names
 */
export const STORE_NAMES = {
	uniqueIDs: 'uniqueIDs',
	styleCards: 'styleCards',
	wordPressAPI: 'wordPressAPI',
};

/**
 * Open IndexedDB connection with all required object stores
 *
 * @param {string} callerName Name of the calling module (for logging)
 * @returns {Promise<IDBDatabase>} Database connection
 */
export const openDB = callerName => {
	return new Promise((resolve, reject) => {
		// Check if IndexedDB is available
		if (!window.indexedDB) {
			// eslint-disable-next-line no-console
			console.warn(
				`[${callerName}] IndexedDB not available, falling back to memory cache`
			);
			reject(new Error('IndexedDB not available'));
			return;
		}

		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => {
			// eslint-disable-next-line no-console
			console.warn(
				`[${callerName}] Failed to open database:`,
				JSON.stringify(request.error)
			);
			reject(request.error);
		};

		request.onsuccess = () => {
			resolve(request.result);
		};

		request.onupgradeneeded = event => {
			const db = event.target.result;

			// Create all required object stores (shared database across all cache modules)
			Object.values(STORE_NAMES).forEach(storeName => {
				if (!db.objectStoreNames.contains(storeName)) {
					db.createObjectStore(storeName, { keyPath: 'key' });
				}
			});
		};
	});
};

/**
 * Helper to execute a transaction and return a promise
 *
 * @param {IDBTransaction} transaction The transaction to execute
 * @param {IDBDatabase}    db          Database connection to close
 * @param {string}         callerName  Name of the calling module (for logging)
 * @param {string}         operation   Operation name (for logging)
 * @returns {Promise<void>}
 */
export const executeTransaction = (transaction, db, callerName, operation) => {
	return new Promise((resolve, reject) => {
		transaction.oncomplete = () => {
			db.close();
			resolve();
		};

		transaction.onerror = () => {
			db.close();
			// eslint-disable-next-line no-console
			console.warn(
				`[${callerName}] Failed to ${operation}:`,
				JSON.stringify(transaction.error)
			);
			reject(transaction.error);
		};
	});
};

/**
 * Helper to execute a request and return a promise
 *
 * @param {IDBRequest}  request    The request to execute
 * @param {IDBDatabase} db         Database connection to close
 * @param {string}      callerName Name of the calling module (for logging)
 * @param {string}      operation  Operation name (for logging)
 * @returns {Promise<any>}
 */
export const executeRequest = (request, db, callerName, operation) => {
	return new Promise((resolve, reject) => {
		request.onsuccess = () => {
			db.close();
			resolve(request.result);
		};

		request.onerror = () => {
			db.close();
			// eslint-disable-next-line no-console
			console.warn(
				`[${callerName}] Failed to ${operation}:`,
				JSON.stringify(request.error)
			);
			reject(request.error);
		};
	});
};
