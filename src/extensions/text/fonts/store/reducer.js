/**
 * Internal dependencies
 */
import fonts from '../fonts';

/**
 * Reducer managing the styles
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
function reducer(state = { fonts: { ...fonts } }, action) {
	switch (action.type) {
		case 'RECEIVE_FONTS':
			return {
				...state,
			};
		default:
			return state;
	}
}

export default reducer;
