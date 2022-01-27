/**
 * Internal dependencies
 */
import controls from './controls';

/**
 * Reducer managing the customData
 *
 * @param {Object} customData Current customData.
 * @param {Object} action     Dispatched action.
 * @return {Object} Updated customData.
 */
function reducer(state = { customData: {}, isUpdate: null }, action) {
	switch (action.type) {
		case 'UPDATE_CUSTOM_DATA':
			return {
				...state,
				customData: { ...state.customData, ...action.customData },
			};
		case 'SAVE_CUSTOM_DATA':
			controls.SAVE_CUSTOM_DATA({
				customData: state.customData,
				isUpdate: action.isUpdate,
			});
			return {
				...state,
				isUpdate: action.isUpdate,
			};
		case 'REMOVE_CUSTOM_DATA':
			delete state.customData[action.target];

			return {
				...state,
			};
		default:
			return state;
	}
}

export default reducer;
