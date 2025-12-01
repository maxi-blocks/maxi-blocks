/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { createSelectors } from '@extensions/styles/custom-css';
import { getCanvasSettings, getAdvancedSettings } from '@extensions/relations';
import transitionDefault from '@extensions/styles/transitions/transitionDefault';

/**
 * Classnames
 */
const blockClass = ' .maxi-number-counter';
const boxClass = `${blockClass}__box`;

const prefix = 'number-counter-';

/**
 * Data object
 */
const name = 'number-counter-maxi';
const copyPasteMapping = {
	_exclude: ['number-counter-start', 'number-counter-end'],
	settings: {
		[__('Alignment', 'maxi-blocks')]: {
			groupAttributes: 'alignment',
		},
		[__('Number', 'maxi-blocks')]: {
			groupAttributes: 'numberCounter',
		},
		[__('Border', 'maxi-blocks')]: {
			template: 'border',
			prefix,
		},
		[__('Box shadow', 'maxi-blocks')]: {
			template: 'boxShadow',
			prefix,
		},
		[__('Margin/Padding', 'maxi-blocks')]: {
			template: 'marginPadding',
			prefix,
		},
	},
	canvas: {
		[__('Size', 'maxi-blocks')]: {
			template: 'size',
		},
		[__('Background', 'maxi-blocks')]: {
			template: 'blockBackground',
		},
		[__('Border', 'maxi-blocks')]: {
			template: 'border',
		},
		[__('Box shadow', 'maxi-blocks')]: {
			template: 'boxShadow',
		},
		[__('Opacity', 'maxi-blocks')]: {
			template: 'opacity',
		},
		[__('Margin/Padding', 'maxi-blocks')]: {
			template: 'marginPadding',
		},
	},
	advanced: {
		template: 'advanced',
	},
};
const customCss = {
	selectors: {
		...createSelectors({
			canvas: '',
			number: `${boxClass}__text`,
		}),
		...createSelectors(
			{
				circle: `${boxClass}__circle`,
			},
			false
		),
	},
	categories: [
		'canvas',
		'before canvas',
		'after canvas',
		'number',
		'before number',
		'after number',
		'circle',
		'background',
		'background hover',
	],
};
const ariaLabelsCategories = ['canvas', 'circle'];
const transition = {
	...transitionDefault,
	block: {
		border: {
			title: 'Border',
			target: boxClass,
			property: ['border', 'border-radius'],
			hoverProp: `${prefix}border-status-hover`,
		},
		'box shadow': {
			title: __('Box shadow', 'maxi-blocks'),
			target: boxClass,
			property: 'box-shadow',
			hoverProp: `${prefix}box-shadow-status-hover`,
		},
	},
};
const interactionBuilderSettings = {
	canvas: getCanvasSettings({ name }),
	advanced: getAdvancedSettings({ customCss }),
};

const data = {
	name,
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
};

export {
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	ariaLabelsCategories,
};
export default data;
