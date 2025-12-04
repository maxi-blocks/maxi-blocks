/**
 * IndexedDB wrapper for WordPress API cache persistence
 * Caches posts, pages, taxonomies, and other WordPress entities
 *
 * Benefits:
 * - Dramatically reduces 2+ second WordPress API calls
 * - Survives page reloads and browser sessions
 * - Large storage capacity for posts/taxonomies
 * - Configurable TTL per entity type
 */

const DB_NAME = 'maxiBlocksCache';
const DB_VERSION = 2; // Same version as other caches
const STORE_NAME = 'wordPressAPI';

// Cache TTL (Time To Live) per entity type
const CACHE_TTL = {
	posts: 5 * 60 * 1000, // 5 minutes
	pages: 5 * 60 * 1000, // 5 minutes
	categories: 15 * 60 * 1000, // 15 minutes (less frequent changes)
	tags: 15 * 60 * 1000, // 15 minutes
	users: 30 * 60 * 1000, // 30 minutes (rarely change)
	media: 10 * 60 * 1000, // 10 minutes
	taxonomies: 30 * 60 * 1000, // 30 minutes
	default: 5 * 60 * 1000, // 5 minutes default
};

/**
 * Open IndexedDB connection
 *
 * @returns {Promise<IDBDatabase>} Database connection
 */
const openDB = () => {
	return new Promise((resolve, reject) => {
		if (!window.indexedDB) {
			reject(new Error('IndexedDB not available'));
			return;
		}

		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => {
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
			if (!db.objectStoreNames.contains('styleCards')) {
				db.createObjectStore('styleCards', { keyPath: 'key' });
			}
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: 'key' });
			}
		};
	});
};

/**
 * Generate cache key from query parameters
 *
 * @param {string} entityType Entity type (postType, taxonomy, etc.)
 * @param {string} entityName Entity name (post, category, etc.)
 * @param {Object} args       Query arguments
 * @returns {string} Cache key
 */
const generateCacheKey = (entityType, entityName, args = {}) => {
	// Create a deterministic key from the query
	const sortedArgs = Object.keys(args)
		.sort()
		.map(key => `${key}:${JSON.stringify(args[key])}`)
		.join('|');

	return `${entityType}:${entityName}:${sortedArgs}`;
};

/**
 * Get TTL for entity type
 *
 * @param {string} entityName Entity name
 * @returns {number} TTL in milliseconds
 */
const getTTL = entityName => {
	return CACHE_TTL[entityName] || CACHE_TTL.default;
};

/**
 * Save WordPress API response to IndexedDB
 *
 * @param {string} entityType Entity type
 * @param {string} entityName Entity name
 * @param {Object} args       Query arguments
 * @param {Array}  data       Response data
 * @returns {Promise<void>}
 */
export const saveToCache = async (entityType, entityName, args, data) => {
	try {
		const db = await openDB();
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);

		const cacheKey = generateCacheKey(entityType, entityName, args);
		const cacheData = {
			key: cacheKey,
			entityType,
			entityName,
			args,
			data,
			timestamp: Date.now(),
			ttl: getTTL(entityName),
		};

		store.put(cacheData);

		return new Promise(resolve => {
			transaction.oncomplete = () => {
				db.close();
				resolve();
			};

			transaction.onerror = () => {
				db.close();
				// Silently fail - resolve instead of reject to keep cache best-effort
				resolve();
			};
		});
	} catch (error) {
		// Silently fail - caching is optional
		return null;
	}
};

/**
 * Load WordPress API response from IndexedDB
 *
 * @param {string} entityType Entity type
 * @param {string} entityName Entity name
 * @param {Object} args       Query arguments
 * @returns {Promise<Array|null>} Cached data or null if expired/not found
 */
export const loadFromCache = async (entityType, entityName, args) => {
	try {
		const db = await openDB();
		const transaction = db.transaction([STORE_NAME], 'readonly');
		const store = transaction.objectStore(STORE_NAME);

		const cacheKey = generateCacheKey(entityType, entityName, args);
		const request = store.get(cacheKey);

		return new Promise(resolve => {
			request.onsuccess = () => {
				db.close();
				const { result } = request;

				if (!result) {
					resolve(null);
					return;
				}

				// Check if cache is expired
				const age = Date.now() - result.timestamp;
				if (age > result.ttl) {
					resolve(null);
					return;
				}

				resolve(result.data);
			};

			request.onerror = () => {
				db.close();
				// Silently fail - resolve null instead of reject to keep cache best-effort
				resolve(null);
			};
		});
	} catch (error) {
		// Silently fail - just return null
		return null;
	}
};

/**
 * Clear cache for specific entity type
 *
 * @param {string} entityType Optional entity type to clear (clears all if not specified)
 * @returns {Promise<void>}
 */
export const clearCache = async (entityType = null) => {
	try {
		const db = await openDB();
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);

		if (entityType) {
			// Clear specific entity type
			const request = store.openCursor();

			request.onsuccess = event => {
				const cursor = event.target.result;
				if (cursor) {
					if (cursor.value.entityType === entityType) {
						cursor.delete();
					}
					cursor.continue();
				}
			};
		} else {
			// Clear all
			store.clear();
		}

		return new Promise(resolve => {
			transaction.oncomplete = () => {
				db.close();
				resolve();
			};

			transaction.onerror = () => {
				db.close();
				// Silently fail - resolve instead of reject to keep cache best-effort
				resolve();
			};
		});
	} catch (error) {
		// Silently fail
		return null;
	}
};

/**
 * Clean up expired cache entries
 * Should be called periodically
 *
 * @returns {Promise<void>}
 */
export const cleanupExpiredCache = async () => {
	try {
		const db = await openDB();
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

		return new Promise(resolve => {
			transaction.oncomplete = () => {
				db.close();
				resolve();
			};

			transaction.onerror = () => {
				db.close();
				// Silently fail - resolve instead of reject to keep cache best-effort
				resolve();
			};
		});
	} catch (error) {
		// Silently fail
		return null;
	}
};

// Expose for debugging
window.maxiBlocksClearWPAPICache = clearCache;
window.maxiBlocksCleanupWPAPICache = cleanupExpiredCache;
