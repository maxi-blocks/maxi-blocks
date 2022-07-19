/**
 * WordPress dependencies
 */
import { createReduxStore, register } from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import controls from './controls';
import * as selectors from './selectors';
import * as actions from './actions';

const store = createReduxStore('maxiBlocks/customData', {
	reducer,
	controls,
	selectors,
	actions,
});

register(store);
