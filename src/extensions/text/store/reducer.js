/**
 * Internal dependencies
 */
import fonts from '../fonts/fonts';

/**
 * External dependencies
 */
import { uniq, isEqual } from 'lodash';

/**
 * Reducer managing the styles
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 * @return {Object} Updated state.
 */
function reducer(
	state = { fonts: { ...fonts }, formatValues: {}, postFonts: [] },
	action
) {
	switch (action.type) {
		case 'RECEIVE_FONTS':
			return {
				...state,
			};
		case 'RECEIVE_FORMAT_VALUE':
			return {
				...state,
				clientId: action.clientId,
			};
		case 'SEND_FORMAT_VALUE':
			if (
				!isEqual(
					state.formatValues[action.clientID],
					action.formatValue
				)
			)
				return {
					...state,
					formatValues: {
						...state.formatValues,
						[action.clientId]: action.formatValue,
					},
				};

			return state;
		case 'REMOVE_FORMAT_VALUE':
			delete state.formatValues[action.clientId];
			return state;
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
