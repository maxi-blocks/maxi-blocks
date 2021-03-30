/**
 * WordPress dependencies
 */
const { registerStore } = wp.data;

/**
 * Internal dependencies
 */
import reducer from './reducer';
import actions from './actions';
import * as selectors from './selectors';

registerStore('maxiBlocks/text', { reducer, actions, selectors });
