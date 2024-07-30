/**
 * Internal dependencies
 */
import fonts from '../../../../core/post-management/fonts.json';

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
			return {
				...state,
				postFonts: uniq([...action.fonts]),
			};
		default:
			return state;
	}
}

export default reducer;
