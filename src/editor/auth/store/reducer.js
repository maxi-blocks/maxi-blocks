/**
 * Internal dependencies
 */
import controls from './controls';

function reducer(state = { data: { data: 'no', name: '' } }, action) {
	switch (action.type) {
		case 'SEND_PRO_STATUS':
			return {
				...state,
				data: action.data,
			};
		case 'SAVE_PRO_STATUS':
			controls.SAVE_PRO_STATUS(action.data);

			return {
				...state,
				data: action.data,
			};
		default:
			return state;
	}
}

export default reducer;
