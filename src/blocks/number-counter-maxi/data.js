import { createSelectors } from '../../extensions/styles/custom-css';
import getCanvasSettings from '../../components/relation-control/getCanvasSettings';
import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

/**
 * Classnames
 */
const blockClass = ' .maxi-number-counter';
const boxClass = `${blockClass}__box`;

const prefix = 'number-counter-';

const data = {
	name: 'number-counter-maxi',
	copyPasteMapping: {
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
	},
	customCss: {
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
	},
	transition: {
		...transitionDefault,
		block: {
			border: {
				title: 'Border',
				target: boxClass,
				property: 'border',
				prefix,
			},
			'box shadow': {
				title: 'Box shadow',
				target: boxClass,
				property: 'box-shadow',
				prefix,
			},
		},
	},
	get interactionBuilderSettings() {
		return getCanvasSettings(this);
	},
};

const { copyPasteMapping, customCss, transition, interactionBuilderSettings } =
	data;

export { copyPasteMapping, customCss, transition, interactionBuilderSettings };
export default data;
