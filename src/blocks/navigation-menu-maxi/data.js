import getCanvasSettings from '../../components/relation-control/getCanvasSettings';
import { createSelectors } from '../../extensions/styles/custom-css';
import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

/**
 * Data object
 */
const name = 'navigation-menu-maxi';
const copyPasteMapping = {
	settings: {
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
	},
	advanced: {
		template: 'advanced',
	},
};
const customCss = {
	selectors: {
		...createSelectors({
			canvas: '',
		}),
	},
	categories: [
		'canvas',
		'before canvas',
		'after canvas',
		'background',
		'background hover',
	],
};
const transition = {
	...transitionDefault,
	block: {
		typography: {
			title: 'Typography',
			target: ' .menu-item__content',
			hoverProp: 'menu-item-typography-status-hover',
		},
		'menu item effect': {
			title: 'Menu item effect',
			target: [
				' .menu-item__content::before',
				' .menu-item__content::after',
			],
			hoverProp: 'effect-status-hover',
		},
	},
};
const interactionBuilderSettings = getCanvasSettings({ name, customCss });

const data = {
	name,
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
};

export { copyPasteMapping, customCss, transition, interactionBuilderSettings };
export default data;
