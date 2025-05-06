import {
	limitTypes,
	orderTypes,
	relationTypes,
	WCTypeOptions,
} from '@extensions/DC/constants';
import { __ } from '@wordpress/i18n';
import {
	sourceOptions,
	generalTypeOptions,
	imageTypeOptions,
	ACFTypeOptions,
} from './initConstants';

const createTypeOptions = (
	generalTypeOptions,
	imageTypeOptions,
	acfTypeOptions
) => ({
	text: generalTypeOptions,
	button: generalTypeOptions,
	image: imageTypeOptions,
	container: generalTypeOptions,
	row: generalTypeOptions,
	column: generalTypeOptions,
	group: generalTypeOptions,
	pane: generalTypeOptions,
	slide: generalTypeOptions,
	accordion: generalTypeOptions,
	slider: generalTypeOptions,
	acf: acfTypeOptions,
	divider: generalTypeOptions,
});

const initialState = {
	relationTypes,
	orderTypes,
	limitTypes,
	acfGroups: null,
	acfFields: null,
	customPostTypes: [],
	customTaxonomies: [],
	wasCustomPostTypesLoaded: false,
	wasCustomTaxonomiesLoaded: false,
	integrationPlugins: [],
	integrationListLoaded: false,
	sourceOptions,
	generalTypeOptions,
	imageTypeOptions,
	ACFTypeOptions,
	typeOptions: createTypeOptions(
		generalTypeOptions,
		imageTypeOptions,
		ACFTypeOptions
	),
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
		case 'SET_INTEGRATION_OPTIONS': {
			const integrationPlugins = action.integrationPlugins || [];

			const sourceOptions = [...state.sourceOptions];
			if (integrationPlugins.includes('acf')) {
				sourceOptions.push({
					label: __('ACF', 'maxi-blocks'),
					value: 'acf',
				});
			}

			const generalTypeOptions = [...state.generalTypeOptions];
			if (integrationPlugins.includes('woocommerce')) {
				generalTypeOptions.push(...WCTypeOptions);
			}

			let imageTypeOptions = generalTypeOptions.filter(
				option => !['categories', 'tags'].includes(option.value)
			);

			if (integrationPlugins.includes('woocommerce')) {
				imageTypeOptions = [
					...imageTypeOptions,
					...WCTypeOptions.filter(option =>
						['products'].includes(option.value)
					),
				];
			}

			const acfTypeOptions = generalTypeOptions.filter(
				option => !['settings'].includes(option.value)
			);

			const typeOptions = createTypeOptions(
				generalTypeOptions,
				imageTypeOptions,
				acfTypeOptions
			);

			return {
				...state,
				integrationPlugins,
				integrationListLoaded: true,
				sourceOptions,
				generalTypeOptions,
				imageTypeOptions,
				acfTypeOptions,
				typeOptions,
			};
		}
		default:
			return state;
	}
};

export default reducer;
