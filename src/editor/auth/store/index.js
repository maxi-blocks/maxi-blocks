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
import resolvers from './resolvers';

const store = createReduxStore('maxiBlocks/pro', {
	reducer,
	controls,
	selectors,
	actions,
	resolvers,
});

register(store);
