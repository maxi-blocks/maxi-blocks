/**
 * Internal dependencies
 */
import { createSelectors } from '../../extensions/attributes/custom-css';
import { transitionDefault } from '../../extensions/attributes/transitions';
import {
	getCanvasSettings,
	getAdvancedSettings,
} from '../../extensions/relations';

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
	_exclude: ['ncsa', 'nnce'],
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
const transition = {
	...transitionDefault,
	block: {
		border: {
			title: 'Border',
			target: boxClass,
			property: ['border', 'border-radius'],
			hoverProp: `${prefix}bo.sh`,
		},
		'box shadow': {
			title: 'Box shadow',
			target: boxClass,
			property: 'box-shadow',
			hoverProp: `${prefix}bs.sh`,
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

export { copyPasteMapping, customCss, transition, interactionBuilderSettings };
export default data;
