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
function reducer(
	state = { fonts: {}, postFonts: [], fontUrls: {}, customFonts: {} },
	action
) {
	switch (action.type) {
		case 'SET_FONTS':
			return {
				...state,
				fonts: action.fonts,
				customFonts: action.customFonts ?? {},
			};
		case 'UPDATE_FONTS':
			return {
				...state,
				postFonts: uniq([...action.fonts]),
			};
		case 'SET_FONT_URL':
			return {
				...state,
				fontUrls: {
					...state.fontUrls,
					[action.name]: action.url,
				},
			};
		default:
			return state;
	}
}

export default reducer;
