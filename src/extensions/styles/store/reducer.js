/**
 * Internal dependencies
 */
import controls from './controls';

/**
 * Reducer managing the styles
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 * @return {Object} Updated state.
 */
function reducer(state = { styles: {}, isUpdate: null }, action) {
	switch (action.type) {
		case 'UPDATE_STYLES':
			return {
				...state,
				styles: {
					...state.styles,
					...action.styles,
				},
			};
		case 'SAVE_STYLES':
			controls.SAVE_STYLES({
				styles: state.styles,
				isUpdate: action.isUpdate,
			});
			return {
				...state,
				isUpdate: action.isUpdate,
			};
		case 'REMOVE_STYLES':
			action.targets.forEach(target => delete state.styles[target]);
			return {
				...state,
			};
		default:
			return state;
	}
}

export default reducer;
