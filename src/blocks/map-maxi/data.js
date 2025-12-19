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
				[__('Minimum zoom', 'maxi-blocks')]: 'map-min-zoom',
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

const inlineStylesTargets = {
	block: '',
	popup: popupClass,
	title: popupTitleClass,
	description: popupDescriptionClass,
};

const attributesToStyles = {
	'font-size': {
		target: inlineStylesTargets.title,
		property: 'font-size',
	},
	'line-height': {
		target: inlineStylesTargets.title,
		property: 'line-height',
	},
	'letter-spacing': {
		target: inlineStylesTargets.title,
		property: 'letter-spacing',
	},
	'text-indent': {
		target: inlineStylesTargets.title,
		property: 'text-indent',
	},
	'word-spacing': {
		target: inlineStylesTargets.title,
		property: 'word-spacing',
	},
	'bottom-gap': {
		target: inlineStylesTargets.title,
		property: 'margin-bottom',
	},
	'description-font-size': {
		target: inlineStylesTargets.description,
		property: 'font-size',
	},
	'description-line-height': {
		target: inlineStylesTargets.description,
		property: 'line-height',
	},
	'description-letter-spacing': {
		target: inlineStylesTargets.description,
		property: 'letter-spacing',
	},
	'description-text-indent': {
		target: inlineStylesTargets.description,
		property: 'text-indent',
	},
	'description-word-spacing': {
		target: inlineStylesTargets.description,
		property: 'word-spacing',
	},
	'description-bottom-gap': {
		target: inlineStylesTargets.description,
		property: 'margin-bottom',
	},
	'border-top-width': {
		target: inlineStylesTargets.block,
		property: 'border-top-width',
	},
	'border-right-width': {
		target: inlineStylesTargets.block,
		property: 'border-right-width',
	},
	'border-bottom-width': {
		target: inlineStylesTargets.block,
		property: 'border-bottom-width',
	},
	'border-left-width': {
		target: inlineStylesTargets.block,
		property: 'border-left-width',
	},
	'border-top-left-radius': {
		target: inlineStylesTargets.block,
		property: 'border-top-left-radius',
	},
	'border-top-right-radius': {
		target: inlineStylesTargets.block,
		property: 'border-top-right-radius',
	},
	'border-bottom-right-radius': {
		target: inlineStylesTargets.block,
		property: 'border-bottom-right-radius',
	},
	'border-bottom-left-radius': {
		target: inlineStylesTargets.block,
		property: 'border-bottom-left-radius',
	},
	opacity: {
		target: inlineStylesTargets.block,
		property: 'opacity',
	},
	'flex-grow': {
		target: inlineStylesTargets.block,
		property: 'flex-grow',
	},
	'flex-shrink': {
		target: inlineStylesTargets.block,
		property: 'flex-shrink',
	},
	'row-gap': {
		target: inlineStylesTargets.block,
		property: 'row-gap',
	},
	'column-gap': {
		target: inlineStylesTargets.block,
		property: 'column-gap',
	},
	order: {
		target: inlineStylesTargets.block,
		property: 'order',
	},
	'margin-top': {
		target: inlineStylesTargets.block,
		property: 'margin-top',
	},
	'margin-right': {
		target: inlineStylesTargets.block,
		property: 'margin-right',
	},
	'margin-bottom': {
		target: inlineStylesTargets.block,
		property: 'margin-bottom',
	},
	'margin-left': {
		target: inlineStylesTargets.block,
		property: 'margin-left',
	},
	'padding-top': {
		target: inlineStylesTargets.block,
		property: 'padding-top',
	},
	'padding-right': {
		target: inlineStylesTargets.block,
		property: 'padding-right',
	},
	'padding-bottom': {
		target: inlineStylesTargets.block,
		property: 'padding-bottom',
	},
	'padding-left': {
		target: inlineStylesTargets.block,
		property: 'padding-left',
	},
	'position-top': {
		target: inlineStylesTargets.block,
		property: 'top',
	},
	'position-right': {
		target: inlineStylesTargets.block,
		property: 'right',
	},
	'position-bottom': {
		target: inlineStylesTargets.block,
		property: 'bottom',
	},
	'position-left': {
		target: inlineStylesTargets.block,
		property: 'left',
	},
	width: {
		target: inlineStylesTargets.block,
		property: 'width',
	},
	height: {
		target: inlineStylesTargets.block,
		property: 'height',
	},
	'min-width': {
		target: inlineStylesTargets.block,
		property: 'min-width',
	},
	'min-height': {
		target: inlineStylesTargets.block,
		property: 'min-height',
	},
	'max-width': {
		target: inlineStylesTargets.block,
		property: 'max-width',
	},
	'max-height': {
		target: inlineStylesTargets.block,
		property: 'max-height',
	},
};

const data = {
	name,
	copyPasteMapping,
	customCss,
	interactionBuilderSettings,
	attributesToStyles,
};

export {
	copyPasteMapping,
	customCss,
	interactionBuilderSettings,
	ariaLabelsCategories,
	attributesToStyles,
};
export default data;
