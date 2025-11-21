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
 * Preload uniqueID cache from database for O(1) lookup performance
 * This fetches all existing uniqueIDs site-wide on editor init
 */
const initUniqueIDCache = async () => {
	try {
		console.log('[initUniqueIDCache] 🔄 Loading uniqueID cache from DB...');
		const startTime = performance.now();

		const uniqueIDs = await apiFetch({
			path: '/maxi-blocks/v1.0/unique-ids/all',
			method: 'GET',
		});

		if (Array.isArray(uniqueIDs)) {
			dispatch('maxiBlocks/blocks').loadUniqueIDCache(uniqueIDs);
			const endTime = performance.now();
			console.log(
				`[initUniqueIDCache] ✅ Cache loaded: ${JSON.stringify(uniqueIDs.length)} IDs in ${JSON.stringify(Math.round(endTime - startTime))}ms`
			);
		}
	} catch (error) {
		// Silently fail - cache will just be empty and fallback to tree traversal
		console.error(
			'[initUniqueIDCache] ❌ Failed to preload uniqueID cache:',
			JSON.stringify(error)
		);
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
