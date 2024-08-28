/**
 * WordPress dependencies
 */
import { createReduxStore, dispatch, register } from '@wordpress/data';

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
});

register(store);

// Dispatch the fetchFonts action to load the fonts initially
dispatch('maxiBlocks/text').fetchFonts();
