/**
 * WordPress dependencies
 */
import { registerStore } from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import actions from './actions';
import * as selectors from './selectors';

registerStore('maxiBlocks/columns', { reducer, actions, selectors });
