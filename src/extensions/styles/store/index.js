/**
 * WordPress dependencies
 */
import { register, createReduxStore } from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import controls from './controls';
import * as selectors from './selectors';
import * as actions from './actions';
import { initializeStyleCacheCleanup } from './cacheCleanup';

const store = createReduxStore('maxiBlocks/styles', {
	reducer,
	controls,
	selectors,
	actions,
});

register(store);
initializeStyleCacheCleanup();
