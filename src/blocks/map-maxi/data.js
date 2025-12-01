/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

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
		[__('Configure map', 'maxi-blocks')]: {
			group: {
				[__('Map provider', 'maxi-blocks')]: 'map-provider',
				[__('Minium zoom', 'maxi-blocks')]: 'map-min-zoom',
				[__('Maximum zoom', 'maxi-blocks')]: 'map-max-zoom',
			},
		},
		[__('Map marker', 'maxi-blocks')]: {
			group: {
				[__('Markers', 'maxi-blocks')]: 'map-markers',
				[__('Marker icon', 'maxi-blocks')]: [
					'map-marker-icon',
					'map-marker',
				],
				[__('Marker fill colour', 'maxi-blocks')]: {
					props: 'svg-fill',
					isPalette: true,
				},
				[__('Marker line colour', 'maxi-blocks')]: {
					props: 'svg-line',
					isPalette: true,
				},
				[__('Marker size', 'maxi-blocks')]: {
					props: 'svg-width',
					hasBreakpoints: true,
				},
			},
		},
		[__('Map popup text', 'maxi-blocks')]: {
			group: {
				[__('Title text level', 'maxi-blocks')]:
					'map-marker-heading-level',
				[__('Title typography', 'maxi-blocks')]: {
					groupAttributes: 'typography',
				},
				[__('Description typography', 'maxi-blocks')]: {
					groupAttributes: 'typography',
					prefix: 'description-',
				},
			},
		},
		[__('Map popup', 'maxi-blocks')]: {
			group: {
				[__('Background', 'maxi-blocks')]: {
					groupAttributes: ['background', 'backgroundColor'],
					prefix: 'popup-',
				},
				[__('Box shadow', 'maxi-blocks')]: {
					groupAttributes: 'boxShadow',
					prefix: 'popup-',
				},
			},
		},
		[__('Border', 'maxi-blocks')]: {
			template: 'border',
		},
		[__('Box shadow', 'maxi-blocks')]: {
			template: 'boxShadow',
		},
		[__('Size', 'maxi-blocks')]: {
			template: 'size',
		},
		[__('Margin/Padding', 'maxi-blocks')]: {
			template: 'marginPadding',
		},
		[__('Map interaction', 'maxi-blocks')]: {
			group: {
				[__('Map dragging', 'maxi-blocks')]: 'map-dragging',
				[__('Map touch zoom', 'maxi-blocks')]: 'map-touch-zoom',
				[__('Map double click zoom', 'maxi-blocks')]:
					'map-double-click-zoom',
				[__('Map scroll wheel zoom', 'maxi-blocks')]:
					'map-scroll-wheel-zoom',
			},
		},
	},
	advanced: {
		template: 'advanced',
		[__('Opacity', 'maxi-blocks')]: {
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
