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

const getLocalStorageFlag = key => {
	if (typeof window === 'undefined') {
		return null;
	}

	try {
		return window.localStorage ? localStorage.getItem(key) : null;
	} catch (error) {
		return null;
	}
};

const isDebugEnabled = () => {
	if (process.env.NODE_ENV === 'development') {
		return true;
	}

	if (typeof window === 'undefined') {
		return false;
	}

	if (window.__MAXI_DEBUG_IDB || window.__MAXI_DEBUG) {
		return true;
	}

	return (
		getLocalStorageFlag('maxiBlocks-debug') === 'true' ||
		getLocalStorageFlag('maxiBlocks-debug-idb') === 'true'
	);
};

const normalizeError = error => {
	if (!error) {
		return { name: 'UnknownError', message: 'Unknown error' };
	}

	if (typeof error === 'string') {
		return { name: 'Error', message: error };
	}

	const name = error.name || error.constructor?.name || 'Error';
	const message = error.message || `${error}`;
	const code =
		typeof error.code === 'number' || typeof error.code === 'string'
			? error.code
			: undefined;

	return { name, message, code };
};

const logDebug = (callerName, message, details) => {
	if (!isDebugEnabled()) {
		return;
	}

	// eslint-disable-next-line no-console
	console.info(`[${callerName}] ${message}`, details || '');
};

const logError = (callerName, message, error, extra) => {
	const normalized = normalizeError(error);
	const details = { ...normalized, ...extra };

	// eslint-disable-next-line no-console
	console.warn(`[${callerName}] ${message}`, details);
};

let hasLoggedEnv = false;
const logEnvOnce = callerName => {
	if (!isDebugEnabled() || hasLoggedEnv || typeof window === 'undefined') {
		return;
	}

	hasLoggedEnv = true;

	const env = {
		origin: window.location ? window.location.origin : null,
		pathname: window.location ? window.location.pathname : null,
		isSecureContext: window.isSecureContext,
		isTopWindow: window.top === window.self,
		userAgent: window.navigator ? window.navigator.userAgent : null,
		indexedDB: !!window.indexedDB,
	};

	// eslint-disable-next-line no-console
	console.info(`[${callerName}] IndexedDB environment`, env);
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
			logEnvOnce(callerName);
			logError(callerName, 'Failed to open database', request.error);
			reject(request.error);
		};

		request.onsuccess = () => {
			logDebug(callerName, 'Opened database', {
				name: request.result?.name,
				version: request.result?.version,
			});
			resolve(request.result);
		};

		request.onblocked = event => {
			logDebug(callerName, 'Open blocked by another connection', {
				oldVersion: event?.oldVersion,
				newVersion: event?.newVersion,
			});
		};

		request.onupgradeneeded = event => {
			const db = event.target.result;

			logDebug(callerName, 'Upgrade needed', {
				oldVersion: event.oldVersion,
				newVersion: event.newVersion,
				stores: Array.from(db.objectStoreNames || []),
			});

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
			logError(callerName, `Failed to ${operation}`, transaction.error);
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
			logError(callerName, `Failed to ${operation}`, request.error);
			reject(request.error);
		};
	});
};
