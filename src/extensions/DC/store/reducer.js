import { limitTypes, orderTypes, relationTypes } from '../constants';

const initialState = {
	relationTypes,
	orderTypes,
	limitTypes,
	customPostTypes: [],
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case 'UPDATE_CUSTOM_POST_TYPES':
			return {
				...state,
				customPostTypes: action.customPostTypes,
				relationTypes: [
					...state.relationTypes,
					...action.customPostTypes,
				],
				orderTypes: [...state.orderTypes, ...action.customPostTypes],
				limitTypes: [...state.limitTypes, ...action.customLimitTypes],
			};

		default:
			return state;
	}
};

export default reducer;
