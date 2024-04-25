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
		if (state) return state.acfGroups;

		return false;
	},
	getACFFields: (state, groupId) => {
		if (state && state.acfFields) {
			return state.acfFields[groupId];
		}

		return false;
	},
};

export default selectors;
