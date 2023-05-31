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

const prefix = 'nc-';

/**
 * Data object
 */
const name = 'number-counter-maxi';
const copyPasteMapping = {
	_exclude: ['nc_sta', 'nc_e'],
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
	b: {
		bo: {
			ti: 'Border',
			ta: boxClass,
			p: ['bo', 'bo.ra'],
			hp: `${prefix}bo.sh`,
		},
		bs: {
			ti: 'Box shadow',
			ta: boxClass,
			p: 'box-shadow',
			hp: `${prefix}bs.sh`,
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
