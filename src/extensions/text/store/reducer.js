/**
 * Internal dependencies
 */
import fonts from '../fonts/fonts';

/**
 * Reducer managing the styles
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
function reducer(state = { fonts: { ...fonts }, formatValue: {} }, action) {
	switch (action.type) {
		case 'RECEIVE_FONTS':
			return {
				...state,
			};
		case 'RECEIVE_FORMAT_VALUE':
			return {
				...state,
			};
		case 'SEND_FORMAT_VALUE':
			return {
				...state,
				formatValue: action.formatValue,
			};
		default:
			return state;
	}
}

export default reducer;
