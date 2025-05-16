/**
 * WordPress dependencies
 */
import { createReduxStore, dispatch, register } from '@wordpress/data';

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
const store = createReduxStore('maxiBlocks/dynamic-content', {
	reducer,
	actions,
	selectors,
	controls,
	resolvers,
});

register(store);

dispatch('maxiBlocks/dynamic-content').loadCustomPostTypes();
dispatch('maxiBlocks/dynamic-content').loadCustomTaxonomies();
dispatch('maxiBlocks/dynamic-content').loadIntegrationOptions();
