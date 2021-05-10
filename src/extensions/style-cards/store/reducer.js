/**
 * Internal dependencies
 */
import controls from './controls';

function reducer(state = { styleCards: {} }, action) {
	switch (action.type) {
		case 'SEND_STYLE_CARDS':
			return {
				...state,
				styleCards: action.styleCards,
			};
		case 'SAVE_STYLE_CARDS':
			controls.SAVE_STYLE_CARDS(action);
			return {
				...state,
				styleCards: action.styleCards,
			};
		default:
			return state;
	}
}

export default reducer;
