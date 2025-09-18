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
		Alignment: {
			groupAttributes: 'alignment',
		},
		Number: {
			groupAttributes: 'numberCounter',
		},
		Border: {
			template: 'border',
			prefix,
		},
		'Box shadow': {
			template: 'boxShadow',
			prefix,
		},
		'Margin/Padding': {
			template: 'marginPadding',
			prefix,
		},
	},
	canvas: {
		Size: {
			template: 'size',
		},
		Background: {
			template: 'blockBackground',
		},
		Border: {
			template: 'border',
		},
		'Box shadow': {
			template: 'boxShadow',
		},
		Opacity: {
			template: 'opacity',
		},
		'Margin/Padding': {
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
			title: 'Box shadow',
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

const inlineStylesTargets = {
	block: '',
	box: ' .maxi-number-counter__box',
	circle: `${boxClass}__circle`,
	background: `${boxClass}__background`,
	text: `${boxClass}__text`,
	textSup: `${boxClass}__text tspan`,
};

const attributesToStyles = {
	'number-counter-stroke': {
		target: inlineStylesTargets.circle,
		property: 'stroke-width',
	},
	'number-counter-title-font-size': {
		target: inlineStylesTargets.text,
		property: 'font-size',
		unit: 'px',
	},
	'number-counter-width': {
		target: inlineStylesTargets.box,
		property: 'width',
	},
	'number-counter-border-top-width': {
		target: inlineStylesTargets.box,
		property: 'border-top-width',
	},
	'number-counter-border-right-width': {
		target: inlineStylesTargets.box,
		property: 'border-right-width',
	},
	'number-counter-border-bottom-width': {
		target: inlineStylesTargets.box,
		property: 'border-bottom-width',
	},
	'number-counter-border-left-width': {
		target: inlineStylesTargets.box,
		property: 'border-left-width',
	},
	'number-counter-border-top-left-radius': {
		target: inlineStylesTargets.box,
		property: 'border-top-left-radius',
	},
	'number-counter-border-top-right-radius': {
		target: inlineStylesTargets.box,
		property: 'border-top-right-radius',
	},
	'number-counter-border-bottom-right-radius': {
		target: inlineStylesTargets.box,
		property: 'border-bottom-right-radius',
	},
	'number-counter-border-bottom-left-radius': {
		target: inlineStylesTargets.box,
		property: 'border-bottom-left-radius',
	},
	'number-counter-margin-top': {
		target: inlineStylesTargets.box,
		property: 'margin-top',
	},
	'number-counter-margin-right': {
		target: inlineStylesTargets.box,
		property: 'margin-right',
	},
	'number-counter-margin-bottom': {
		target: inlineStylesTargets.box,
		property: 'margin-bottom',
	},
	'number-counter-margin-left': {
		target: inlineStylesTargets.box,
		property: 'margin-left',
	},
	'number-counter-padding-top': {
		target: inlineStylesTargets.box,
		property: 'padding-top',
	},
	'number-counter-padding-right': {
		target: inlineStylesTargets.box,
		property: 'padding-right',
	},
	'number-counter-padding-bottom': {
		target: inlineStylesTargets.box,
		property: 'padding-bottom',
	},
	'number-counter-padding-left': {
		target: inlineStylesTargets.box,
		property: 'padding-left',
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
	transition,
	interactionBuilderSettings,
	attributesToStyles,
};

export {
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	ariaLabelsCategories,
	attributesToStyles,
};
export default data;
