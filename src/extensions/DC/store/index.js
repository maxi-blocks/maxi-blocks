/**
 * WordPress dependencies
 */
import { createReduxStore, dispatch, register } from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import actions from './actions';
import selectors from './selectors';
import controls from './controls';

/**
 * Register Store
 */
const store = createReduxStore('maxiBlocks/dynamic-content', {
	reducer,
	actions,
	selectors,
	controls,
});

register(store);

dispatch('maxiBlocks/dynamic-content').loadCustomPostTypes();
