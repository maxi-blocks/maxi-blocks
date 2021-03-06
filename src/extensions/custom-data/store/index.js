/**
 * WordPress dependencies
 */
const { registerStore } = wp.data;

/**
 * Internal dependencies
 */
import reducer from './reducer';
import controls from './controls';
import * as selectors from './selectors';
import * as actions from './actions';

registerStore('maxiBlocks/customData', {
	reducer,
	controls,
	selectors,
	actions,
});
