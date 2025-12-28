/**
 * IndexedDB wrapper for block CSS cache persistence
 * Stores pre-generated CSS per block to avoid runtime regeneration
 *
 * Benefits:
 * - Eliminates runtime CSS generation on every render
 * - Massive memory savings (no CSS strings held in memory)
 * - Survives page reloads
 * - Auto-invalidates when attributes change (via hash)
 */

import {
	openDB,
	executeTransaction,
	executeRequest,
	STORE_NAMES,
} from '@extensions/common/indexedDBManager';

const STORE_NAME = STORE_NAMES.blockCSS;
const CALLER_NAME = 'cssCacheDB';

/**
 * Generate a simple hash of block attributes for cache invalidation
 * @param {Object} attributes - Block attributes
 * @returns {string} Hash string
 */
export const generateAttributeHash = (attributes) => {
	// Create a simplified hash from key style-related attributes
	const relevantKeys = [
		'uniqueID', 'blockStyle', 'font-size-general', 'color-general',
		'padding-top-general', 'margin-bottom-general', 'border-style-general'
	];
	
	let hashString = '';
	relevantKeys.forEach(key => {
		if (attributes[key] !== undefined) {
			hashString += `${key}:${JSON.stringify(attributes[key])};`;
		}
	});
	
	// Simple string hash
	let hash = 0;
	for (let i = 0; i < hashString.length; i++) {
		const char = hashString.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash.toString(36);
};

/**
 * Save block CSS to IndexedDB cache
 * @param {string} uniqueID - Block unique ID
 * @param {string} cssString - Generated CSS string
 * @param {string} attributeHash - Hash of attributes for cache invalidation
 * @returns {Promise<void>}
 */
export const saveBlockCSS = async (uniqueID, cssString, attributeHash) => {
	try {
		const db = await openDB(CALLER_NAME);
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);

		const data = {
			key: uniqueID,
			css: cssString,
			hash: attributeHash,
			timestamp: Date.now(),
		};

		store.put(data);

		return executeTransaction(transaction, db, CALLER_NAME, 'save CSS');
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn(`[${CALLER_NAME}] Error saving CSS:`, error);
		// Don't throw - cache failures shouldn't break the editor
	}
};

/**
 * Load block CSS from IndexedDB cache
 * @param {string} uniqueID - Block unique ID
 * @param {string} currentHash - Current attribute hash for validation
 * @returns {Promise<string|null>} Cached CSS or null if invalid/missing
 */
export const loadBlockCSS = async (uniqueID, currentHash) => {
	try {
		const db = await openDB(CALLER_NAME);
		const transaction = db.transaction([STORE_NAME], 'readonly');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.get(uniqueID);

		const result = await executeRequest(request, db, CALLER_NAME, 'load CSS');
		
		if (result && result.hash === currentHash) {
			// Cache hit - hash matches, CSS is valid
			return result.css;
		}
		
		// Cache miss - no data or hash mismatch (attributes changed)
		return null;
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn(`[${CALLER_NAME}] Error loading CSS:`, error);
		return null;
	}
};

/**
 * Clear CSS cache for a specific block
 * @param {string} uniqueID - Block unique ID
 * @returns {Promise<void>}
 */
export const clearBlockCSS = async (uniqueID) => {
	try {
		const db = await openDB(CALLER_NAME);
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);

		store.delete(uniqueID);

		return executeTransaction(transaction, db, CALLER_NAME, 'clear CSS');
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn(`[${CALLER_NAME}] Error clearing CSS:`, error);
	}
};

/**
 * Clear all block CSS caches
 * Useful when style cards change or for debugging
 * @returns {Promise<void>}
 */
export const clearAllBlockCSS = async () => {
	try {
		const db = await openDB(CALLER_NAME);
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);

		store.clear();

		return executeTransaction(transaction, db, CALLER_NAME, 'clear all CSS');
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn(`[${CALLER_NAME}] Error clearing all CSS:`, error);
	}
};

/**
 * Get cache statistics for debugging
 * @returns {Promise<{count: number, totalSize: number}>}
 */
export const getCacheStats = async () => {
	try {
		const db = await openDB(CALLER_NAME);
		const transaction = db.transaction([STORE_NAME], 'readonly');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.getAll();

		const results = await executeRequest(request, db, CALLER_NAME, 'get stats');
		
		let totalSize = 0;
		results.forEach(item => {
			totalSize += item.css?.length || 0;
		});

		return {
			count: results.length,
			totalSize,
			totalSizeKB: (totalSize / 1024).toFixed(2),
		};
	} catch (error) {
		return { count: 0, totalSize: 0, totalSizeKB: '0' };
	}
};

// Expose for debugging
if (typeof window !== 'undefined') {
	window.maxiCSSCache = {
		saveBlockCSS,
		loadBlockCSS,
		clearBlockCSS,
		clearAllBlockCSS,
		getCacheStats,
	};
}

export default {
	saveBlockCSS,
	loadBlockCSS,
	clearBlockCSS,
	clearAllBlockCSS,
	getCacheStats,
	generateAttributeHash,
};
