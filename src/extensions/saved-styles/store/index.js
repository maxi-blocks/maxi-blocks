/**
 * WordPress dependencies
 */
import { createReduxStore, register } from '@wordpress/data';

/**
 * Internal dependencies
 */
import actions from './actions';
import controls from './controls';
import reducer from './reducer';
import resolvers from './resolvers';
import selectors from './selectors';

const store = createReduxStore('maxiBlocks/saved-styles', {
	reducer,
	actions,
	selectors,
	controls,
	resolvers,
});

register(store);

export default store;
