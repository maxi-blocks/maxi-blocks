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
};

export default selectors;
