/**
 * WordPress dependencies
 */
const { registerStore } = wp.data;

/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as selectors from './selectors';

registerStore('maxiBlocks/fonts', { reducer, selectors });
