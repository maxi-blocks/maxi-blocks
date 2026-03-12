/**
 * Internal dependencies
 */
import { isEqual } from 'lodash';
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
		case 'UPDATE_CUSTOM_DATA': {
			if (!action.customData || !Object.keys(action.customData).length) {
				return state;
			}

			const hasChanges = Object.entries(action.customData).some(
				([target, targetCustomData]) =>
					!isEqual(state.customData[target], targetCustomData)
			);

			if (!hasChanges) {
				return state;
			}

			return {
				...state,
				customData: { ...state.customData, ...action.customData },
			};
		}
		case 'SAVE_CUSTOM_DATA':
			controls.SAVE_CUSTOM_DATA({
				customData: state.customData,
				isUpdate: action.isUpdate,
			});
			return {
				...state,
				isUpdate: action.isUpdate,
			};
		case 'REMOVE_CUSTOM_DATA': {
			if (
				!Object.prototype.hasOwnProperty.call(
					state.customData,
					action.target
				)
			) {
				return state;
			}

			const nextCustomData = { ...state.customData };
			delete nextCustomData[action.target];

			return {
				...state,
				customData: nextCustomData,
			};
		}
		default:
			return state;
	}
}

export default reducer;
