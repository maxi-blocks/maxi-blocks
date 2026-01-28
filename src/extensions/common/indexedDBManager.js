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

export const IDB_DISABLED_ERROR_CODE = 'MAXI_IDB_DISABLED';
const TEMP_DISABLE_MS = 10000;
const PERMANENT_DISABLE_UNTIL = Number.MAX_SAFE_INTEGER;

const getIndexedDBState = () => {
	const root = typeof window !== 'undefined' ? window : globalThis;
	if (!root.__maxiBlocksIndexedDBState__) {
		root.__maxiBlocksIndexedDBState__ = {
			disabledUntil: 0,
			lastError: null,
			warnedCallers: new Set(),
			disabledError: null,
		};
	}

	return root.__maxiBlocksIndexedDBState__;
};

const getErrorMessage = error => {
	if (!error) return 'unknown error';
	if (error.message) return error.message;
	if (error.name) return error.name;
	return String(error);
};

const shouldDisablePermanently = errorName =>
	['SecurityError', 'InvalidStateError', 'NotAllowedError'].includes(
		errorName
	);

const createDisabledError = cause => {
	const error = new Error('IndexedDB unavailable');
	error.code = IDB_DISABLED_ERROR_CODE;
	error.cause = cause;
	return error;
};

/**
 * Open IndexedDB connection with all required object stores
 *
 * @param {string} callerName Name of the calling module (for logging)
 * @returns {Promise<IDBDatabase>} Database connection
 */
export const openDB = callerName => {
	return new Promise((resolve, reject) => {
		const state = getIndexedDBState();
		const now = Date.now();

		if (state.disabledUntil && now < state.disabledUntil) {
			if (!state.warnedCallers.has(callerName)) {
				state.warnedCallers.add(callerName);
				// eslint-disable-next-line no-console
				console.warn(
					`[${callerName}] IndexedDB disabled, using memory cache`
				);
			}

			reject(state.disabledError || createDisabledError(state.lastError));
			return;
		}

		// Check if IndexedDB is available
		if (!window.indexedDB) {
			// eslint-disable-next-line no-console
			console.warn(
				`[${callerName}] IndexedDB not available, falling back to memory cache`
			);
			const error = createDisabledError(
				new Error('IndexedDB not available')
			);
			state.lastError = error.cause;
			state.disabledError = error;
			state.disabledUntil = PERMANENT_DISABLE_UNTIL;
			state.warnedCallers.add(callerName);
			reject(error);
			return;
		}

		const attemptOpen = canDeleteOnVersionError => {
			const request = indexedDB.open(DB_NAME, DB_VERSION);

			request.onerror = () => {
				const rawError =
					request.error || new Error('IndexedDB open failed');
				const errorName = rawError.name || '';

				if (errorName === 'VersionError' && canDeleteOnVersionError) {
					const deleteRequest = indexedDB.deleteDatabase(DB_NAME);
					deleteRequest.onsuccess = () => {
						attemptOpen(false);
					};
					deleteRequest.onerror = () => {
						const deleteError =
							deleteRequest.error ||
							new Error('IndexedDB delete failed');
						state.lastError = deleteError;
						state.disabledUntil = Date.now() + TEMP_DISABLE_MS;
						state.disabledError = createDisabledError(deleteError);
						// eslint-disable-next-line no-console
						console.warn(
							`[${callerName}] Failed to delete database after VersionError:`,
							getErrorMessage(deleteError)
						);
						state.warnedCallers.add(callerName);
						reject(state.disabledError);
					};
					return;
				}

				const disableUntil = shouldDisablePermanently(errorName)
					? PERMANENT_DISABLE_UNTIL
					: Date.now() + TEMP_DISABLE_MS;
				state.lastError = rawError;
				state.disabledUntil = disableUntil;
				state.disabledError = createDisabledError(rawError);

				// eslint-disable-next-line no-console
				console.warn(
					`[${callerName}] Failed to open database:`,
					getErrorMessage(rawError)
				);
				state.warnedCallers.add(callerName);
				reject(state.disabledError);
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
		};

		attemptOpen(true);
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
				getErrorMessage(transaction.error)
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
				getErrorMessage(request.error)
			);
			reject(request.error);
		};
	});
};
