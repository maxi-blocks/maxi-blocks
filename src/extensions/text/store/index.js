/**
 * WordPress dependencies
 */
import { register, createReduxStore } from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import actions from './actions';
import * as selectors from './selectors';
import resolvers from './resolvers';

const store = createReduxStore('maxiBlocks/text', {
	reducer,
	actions,
	selectors,
	resolvers,
});

register(store);
