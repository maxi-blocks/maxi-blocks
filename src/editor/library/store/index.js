/**
 * WordPress dependencies
 */
const { registerStore } = wp.data;

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
registerStore('maxiBlocks/cloudLibrary', {
	reducer,
	actions,
	selectors,
	controls,
	resolvers,
});
