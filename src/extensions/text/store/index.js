/**
 * WordPress dependencies
 */
import { register, createReduxStore } from '@wordpress/data';
import { controls } from '@wordpress/data-controls';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';

// Create the Redux store for the text domain 'maxiBlocks/text'
const store = createReduxStore('maxiBlocks/text', {
	reducer,
	actions,
	selectors,
	controls,
});

register(store);
