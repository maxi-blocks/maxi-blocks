/**
 * Internal dependencies
 */
import { createSelectors } from '@extensions/styles/custom-css';
import { getAdvancedSettings } from '@extensions/relations';

/**
 * Classnames
 */
const blockClass = ' .maxi-map-block';
const popupClass = `${blockClass}__popup`;
const popupContentClass = `${popupClass}__content`;
const popupTitleClass = `${popupContentClass}__title`;
const popupDescriptionClass = `${popupContentClass}__description`;

/**
 * Data object
 */
const name = 'map-maxi';
const copyPasteMapping = {
	_exclude: ['map-markers'],
	settings: {
		'Configure map': {
			group: {
				'Map provider': 'map-provider',
				'Minium zoom': 'map-min-zoom',
				'Maximum zoom': 'map-max-zoom',
			},
		},
		'Map marker': {
			group: {
				Markers: 'map-markers',
				'Marker icon': ['map-marker-icon', 'map-marker'],
				'Marker fill colour': {
					props: 'svg-fill',
					isPalette: true,
				},
				'Marker line colour': {
					props: 'svg-line',
					isPalette: true,
				},
				'Marker size': {
					props: 'svg-width',
					hasBreakpoints: true,
				},
			},
		},
		'Map popup text': {
			group: {
				'Title text level': 'map-marker-heading-level',
				'Title typography': {
					groupAttributes: 'typography',
				},
				'Description typography': {
					groupAttributes: 'typography',
					prefix: 'description-',
				},
			},
		},
		'Map popup': {
			group: {
				Background: {
					groupAttributes: ['background', 'backgroundColor'],
					prefix: 'popup-',
				},
				'Box shadow': {
					groupAttributes: 'boxShadow',
					prefix: 'popup-',
				},
			},
		},
		Border: {
			template: 'border',
		},
		'Box shadow': {
			template: 'boxShadow',
		},
		Size: {
			template: 'size',
		},
		'Margin/Padding': {
			template: 'marginPadding',
		},
		'Map interaction': {
			group: {
				'Map dragging': 'map-dragging',
				'Map touch zoom': 'map-touch-zoom',
				'Map double click zoom': 'map-double-click-zoom',
				'Map scroll wheel zoom': 'map-scroll-wheel-zoom',
			},
		},
	},
	advanced: {
		template: 'advanced',
		Opacity: {
			template: 'opacity',
		},
	},
};
const customCss = {
	selectors: {
		...createSelectors({
			map: '',
			popup: popupClass,
			title: popupTitleClass,
			description: popupDescriptionClass,
		}),
	},
	categories: [
		'map',
		'before map',
		'after map',
		'popup',
		'after popup',
		'popup arrow',
		'title',
		'after title',
		'before title',
		'description',
		'after description',
		'before description',
	],
};
const ariaLabelsCategories = ['map', 'popup'];
const interactionBuilderSettings = {
	advanced: getAdvancedSettings({ customCss }),
};

const data = {
	name,
	copyPasteMapping,
	customCss,
	interactionBuilderSettings,
};

export {
	copyPasteMapping,
	customCss,
	interactionBuilderSettings,
	ariaLabelsCategories,
};
export default data;
