/**
 * WordPress dependencies
 */
import { createReduxStore, register } from '@wordpress/data';

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
