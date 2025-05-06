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
	getIntegrationPlugins: state => {
		return state?.integrationPlugins || [];
	},
	isIntegrationListLoaded: state => {
		return !!state?.integrationListLoaded;
	},
	hasIntegration: (state, pluginName) => {
		return state?.integrationPlugins?.includes(pluginName) || false;
	},
	getSourceOptions: state => {
		return state?.sourceOptions || [];
	},
	getGeneralTypeOptions: state => {
		return state?.generalTypeOptions || [];
	},
	getImageTypeOptions: state => {
		return state?.imageTypeOptions || [];
	},
	getACFTypeOptions: state => {
		return state?.acfTypeOptions || [];
	},
	getTypeOptions: state => {
		return state?.typeOptions || {};
	},
};

export default selectors;
