/**
 * WordPress dependencies
 */
import { createReduxStore, register, dispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { addAction } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import actions from './actions';
import selectors from './selectors';

/**
 * Register Store
 */
const store = createReduxStore('maxiBlocks/blocks', {
	reducer,
	actions,
	selectors,
});

register(store);

/**
 * Track cache load attempts for retry logic
 */
let cacheLoadAttempts = 0;
const MAX_CACHE_LOAD_ATTEMPTS = 3;
const CACHE_RETRY_DELAY = 5000; // 5 seconds

/**
 * Preload uniqueID cache from database for O(1) lookup performance
 * This fetches all existing uniqueIDs site-wide on editor init
 *
 * Implements retry logic to handle transient network/API failures:
 * - Retries up to MAX_CACHE_LOAD_ATTEMPTS times
 * - Waits CACHE_RETRY_DELAY ms between retries
 * - Falls back to tree traversal if all retries fail
 */
const initUniqueIDCache = async () => {
	try {
		// eslint-disable-next-line no-console
		console.log(
			`[initUniqueIDCache] 🔄 Loading uniqueID cache from DB (attempt ${JSON.stringify(
				cacheLoadAttempts + 1
			)}/${JSON.stringify(MAX_CACHE_LOAD_ATTEMPTS)})...`
		);
		const startTime = performance.now();

		const uniqueIDs = await apiFetch({
			path: '/maxi-blocks/v1.0/unique-ids/all',
			method: 'GET',
		});

		if (Array.isArray(uniqueIDs)) {
			dispatch('maxiBlocks/blocks').loadUniqueIDCache(uniqueIDs);
			const endTime = performance.now();
			// eslint-disable-next-line no-console
			console.log(
				`[initUniqueIDCache] ✅ Cache loaded: ${JSON.stringify(
					uniqueIDs.length
				)} IDs in ${JSON.stringify(Math.round(endTime - startTime))}ms`
			);

			// Reset attempts counter on success
			cacheLoadAttempts = 0;
		}
	} catch (error) {
		cacheLoadAttempts += 1;

		// eslint-disable-next-line no-console
		console.error(
			`[initUniqueIDCache] ❌ Failed to preload uniqueID cache (attempt ${JSON.stringify(
				cacheLoadAttempts
			)}/${JSON.stringify(MAX_CACHE_LOAD_ATTEMPTS)}):`,
			JSON.stringify(error)
		);

		// Retry if we haven't exceeded max attempts
		if (cacheLoadAttempts < MAX_CACHE_LOAD_ATTEMPTS) {
			// eslint-disable-next-line no-console
			console.log(
				`[initUniqueIDCache] ⏳ Retrying in ${JSON.stringify(
					CACHE_RETRY_DELAY / 1000
				)}s...`
			);

			setTimeout(() => {
				initUniqueIDCache();
			}, CACHE_RETRY_DELAY);
		} else {
			// eslint-disable-next-line no-console
			console.warn(
				'[initUniqueIDCache] ⚠️ Max retry attempts reached. Falling back to tree traversal for uniqueID checks.'
			);

			// Reset attempts counter for potential future manual retries
			cacheLoadAttempts = 0;
		}
	}
};

// Initialize cache when editor is ready
addAction('editor.ready', 'maxiBlocks/initUniqueIDCache', initUniqueIDCache);

// Also init on DOMContentLoaded as fallback for FSE and other contexts
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initUniqueIDCache);
} else {
	// DOM already loaded
	initUniqueIDCache();
}
