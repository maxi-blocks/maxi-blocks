/**
 * Internal dependencies
 */
import fonts from '../fonts/fonts';

/**
 * External dependencies
 */
import { uniq } from 'lodash';

/**
 * Reducer managing the styles
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 * @return {Object} Updated state.
 */
function reducer(state = { fonts: { ...fonts }, postFonts: [] }, action) {
	switch (action.type) {
		case 'UPDATE_FONTS':
			console.log('UPDATE_FONTS', uniq([...action.fonts]));
			return {
				...state,
				postFonts: uniq([...action.fonts]),
			};
		default:
			return state;
	}
}

export default reducer;
