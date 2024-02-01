import { limitTypes, orderTypes, relationTypes } from '../constants';

const initialState = {
	relationTypes,
	orderTypes,
	limitTypes,
	customPostTypes: [],
	customTaxonomies: [],
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOAD_CUSTOM_POST_TYPES':
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
		case 'LOAD_CUSTOM_TAXONOMIES':
			return {
				...state,
				customTaxonomies: action.customTaxonomies,
				relationTypes: [
					...state.relationTypes,
					...action.customTaxonomies,
				],
			};
		default:
			return state;
	}
};

export default reducer;
