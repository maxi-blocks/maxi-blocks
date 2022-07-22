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

const store = createReduxStore('maxiBlocks/text', {
	reducer,
	actions,
	selectors,
});

register(store);
