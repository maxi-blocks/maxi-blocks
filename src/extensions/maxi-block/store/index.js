/**
 * WordPress dependencies
 */
import { createReduxStore, register, dispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import actions from './actions';
import selectors from './selectors';
import {
	loadFromIndexedDB,
	saveToIndexedDB,
	clearIndexedDB,
} from './uniqueIDCacheDB';

/**
 * Register Store
 */
const store = createReduxStore('maxiBlocks/blocks', {
	reducer,
	actions,
	selectors,
});

register(store);

// Expose cache clearing function for debugging
window.maxiBlocksClearCache = clearIndexedDB;

/**
 * Track cache load attempts for retry logic
 */
let cacheLoadAttempts = 0;
const MAX_CACHE_LOAD_ATTEMPTS = 3;
const CACHE_RETRY_DELAY = 5000; // 5 seconds

/**
 * Fetch all pages of unique IDs from the API with pagination support
 *
 * @param {string} clientHash Current hash from IndexedDB cache
 * @returns {Promise<{uniqueIDs: Array<string>, hash: string}>} All unique IDs and server hash
 */
const fetchAllUniqueIDs = async (clientHash = '') => {
	const allUniqueIDs = [];
	const page = 1;
	const perPage = 1000;

	try {
		let totalPages = 1;
		let serverHash = '';
		// Fetch first page to get total count and hash
		const firstPage = await apiFetch({
			path: `/maxi-blocks/v1.0/unique-ids/all?page=${JSON.stringify(
				page
			)}&per_page=${JSON.stringify(
				perPage
			)}&client_hash=${encodeURIComponent(clientHash)}`,
			method: 'GET',
		});

		// Check if cache is still valid (304 Not Modified response)
		// WordPress REST API with 304 returns a specific response format
		if (firstPage && firstPage.status === 'not_modified') {
			return null; // Signal that cache is still valid
		}

		// Validate response format
		if (!firstPage || !firstPage.data || !Array.isArray(firstPage.data)) {
			// eslint-disable-next-line no-console
			console.warn(
				'[fetchAllUniqueIDs] Invalid response format:',
				JSON.stringify(firstPage)
			);
			throw new Error('Invalid response format from API');
		}

		// Extract metadata
		totalPages = firstPage.total_pages || 1;
		serverHash = firstPage.hash || '';
		allUniqueIDs.push(...firstPage.data);

		// Fetch remaining pages if needed
		if (totalPages > 1) {
			const pagePromises = [];

			for (let i = 2; i <= totalPages; i += 1) {
				pagePromises.push(
					apiFetch({
						path: `/maxi-blocks/v1.0/unique-ids/all?page=${JSON.stringify(
							i
						)}&per_page=${JSON.stringify(perPage)}`,
						method: 'GET',
					})
				);
			}

			// Fetch all pages in parallel for maximum speed
			const pages = await Promise.all(pagePromises);

			pages.forEach((pageData, index) => {
				if (pageData.data && Array.isArray(pageData.data)) {
					allUniqueIDs.push(...pageData.data);
				}
			});
		}

		return {
			uniqueIDs: allUniqueIDs,
			hash: serverHash,
		};
	} catch (error) {
		// Only log warnings for real errors, not transient test environment issues
		// invalid_json errors during tests are expected and will be retried
		if (error && error.code !== 'invalid_json') {
			// eslint-disable-next-line no-console
			console.warn('[fetchAllUniqueIDs] Error fetching unique IDs:', {
				message: error.message,
				code: error.code,
				data: error.data,
			});
		}
		throw error;
	}
};

/**
 * Preload uniqueID cache from database for O(1) lookup performance
 * This fetches all existing uniqueIDs site-wide on editor init
 *
 * Optimization strategy:
 * 1. Try to load from IndexedDB first (instant)
 * 2. Send hash to server to check if cache is still valid
 * 3. Only fetch new data if cache is stale
 * 4. Use pagination to handle large datasets
 * 5. Fetch pages in parallel for maximum speed
 *
 * Implements retry logic to handle transient network/API failures:
 * - Retries up to MAX_CACHE_LOAD_ATTEMPTS times
 * - Waits CACHE_RETRY_DELAY ms between retries
 * - Falls back to tree traversal if all retries fail
 */
const initUniqueIDCache = async () => {
	try {
		// Step 1: Try to load from IndexedDB
		const cachedData = await loadFromIndexedDB();

		if (
			cachedData &&
			cachedData.uniqueIDs &&
			cachedData.uniqueIDs.length > 0
		) {
			// Load cached data into Redux store immediately
			dispatch('maxiBlocks/blocks').loadUniqueIDCache(
				cachedData.uniqueIDs
			);

			// Step 2: Verify cache is still valid with server
			const result = await fetchAllUniqueIDs(cachedData.hash);

			// If result is null, cache was valid (304 response)
			if (result === null) {
				cacheLoadAttempts = 0;
				return;
			}

			// Cache was stale, update with new data
			if (result && result.uniqueIDs) {
				dispatch('maxiBlocks/blocks').loadUniqueIDCache(
					result.uniqueIDs
				);
				await saveToIndexedDB(result.uniqueIDs, result.hash);
			}
		} else {
			// Step 3: No cache, fetch everything
			const result = await fetchAllUniqueIDs();

			if (result && result.uniqueIDs) {
				dispatch('maxiBlocks/blocks').loadUniqueIDCache(
					result.uniqueIDs
				);
				await saveToIndexedDB(result.uniqueIDs, result.hash);
			}
		}

		// Reset attempts counter on success
		cacheLoadAttempts = 0;
	} catch (error) {
		cacheLoadAttempts += 1;

		// Only log warnings for real errors, not "invalid_json" during tests
		// The invalid_json error often happens during rapid test resets
		const isTestEnvironmentError =
			error &&
			error.code === 'invalid_json' &&
			cacheLoadAttempts <= MAX_CACHE_LOAD_ATTEMPTS;

		if (!isTestEnvironmentError) {
			// eslint-disable-next-line no-console
			console.warn(
				`[initUniqueIDCache] Failed to preload uniqueID cache (attempt ${JSON.stringify(
					cacheLoadAttempts
				)}/${JSON.stringify(MAX_CACHE_LOAD_ATTEMPTS)}):`,
				JSON.stringify(error)
			);
		}

		// Retry if we haven't exceeded max attempts
		if (cacheLoadAttempts < MAX_CACHE_LOAD_ATTEMPTS) {
			setTimeout(() => {
				initUniqueIDCache();
			}, CACHE_RETRY_DELAY);
		} else {
			// Only warn if not a test environment error
			if (!isTestEnvironmentError) {
				// eslint-disable-next-line no-console
				console.warn(
					'[initUniqueIDCache] Max retry attempts reached. Falling back to tree traversal for uniqueID checks.'
				);
			}

			// Reset attempts counter for potential future manual retries
			cacheLoadAttempts = 0;
		}
	}
};

// Initialize cache on DOMContentLoaded for editor and FSE contexts
// Skip initialization in test environment (process.env.NODE_ENV === 'test')
if (process.env.NODE_ENV !== 'test') {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initUniqueIDCache);
	} else {
		// DOM already loaded
		initUniqueIDCache();
	}
}
