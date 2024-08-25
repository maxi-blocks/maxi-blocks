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
function reducer(state = { fonts: {}, postFonts: [] }, action) {
	switch (action.type) {
		case 'SET_FONTS':
			return {
				...state,
				fonts: action.fonts,
			};
		case 'UPDATE_FONTS':
			return {
				...state,
				postFonts: uniq([...action.fonts]),
			};
		default:
			return state;
	}
}

export default reducer;
