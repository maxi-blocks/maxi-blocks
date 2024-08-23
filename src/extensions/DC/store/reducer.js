import { limitTypes, orderTypes, relationTypes } from '../constants';

const initialState = {
	relationTypes,
	orderTypes,
	limitTypes,
	acfGroups: null,
	acfFields: null,
	customerData: {},
	customPostTypes: [],
	customTaxonomies: [],
	wasCustomPostTypesLoaded: false,
	wasCustomTaxonomiesLoaded: false,
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
				wasCustomPostTypesLoaded: true,
			};
		case 'LOAD_CUSTOM_TAXONOMIES':
			return {
				...state,
				customTaxonomies: action.customTaxonomies,
				relationTypes: [
					...state.relationTypes,
					...action.customTaxonomies,
				],
				wasCustomTaxonomiesLoaded: true,
			};
		case 'SET_ACF_GROUPS':
			return {
				...state,
				acfGroups: action.acfGroups,
			};
		case 'SET_ACF_FIELDS':
			return {
				...state,
				acfFields: {
					...state.acfFields,
					[action.groupId]: action.acfFields,
				},
			};
		case 'SET_CUSTOMER_DATA':
			return {
				...state,
				customerData: {
					...state.customerData,
					[action.customerId]: action.customerData,
				},
			};
		default:
			return state;
	}
};

export default reducer;
