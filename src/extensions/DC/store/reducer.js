import { relationTypes } from '../constants';

const initialState = {
	relationTypes,
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
			};

		default:
			return state;
	}
};

export default reducer;
