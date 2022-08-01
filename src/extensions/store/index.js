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
import controls from './controls';
import resolvers from './resolvers';

/**
 * Register Store
 */

const store = createReduxStore('maxiBlocks', {
	reducer,
	actions,
	selectors,
	controls,
	resolvers,
});

register(store);
