const selectors = {
	getRelationTypes: state => {
		if (state) return state.relationTypes;

		return false;
	},
	getCustomPostTypes: state => {
		if (state) return state.customPostTypes;

		return false;
	},
	getOrderTypes: state => {
		if (state) return state.orderTypes;

		return false;
	},
	getLimitTypes: state => {
		if (state) return state.limitTypes;

		return false;
	},
	getCustomTaxonomies: state => {
		if (state) return state.customTaxonomies;

		return false;
	},
	getWasCustomPostTypesLoaded: state => {
		if (state) return state.wasCustomPostTypesLoaded;

		return false;
	},
	getWasCustomTaxonomiesLoaded: state => {
		if (state) return state.wasCustomTaxonomiesLoaded;

		return false;
	},
	getACFGroups: state => {
		return state?.acfGroups;
	},
	getACFFields: (state, groupId) => {
		return state?.acfFields?.[groupId];
	},
	getCustomerData: (state, customerId) => {
		return state?.customerData?.[customerId];
	},
};

export default selectors;
