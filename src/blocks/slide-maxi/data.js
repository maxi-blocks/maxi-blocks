import getCanvasSettings from '../../components/relation-control/getCanvasSettings';
import { createSelectors } from '../../extensions/styles/custom-css';

/**
 * Data object
 */
const name = 'slide-maxi';
const copyPasteMapping = {
	settings: {
		Background: {
			template: 'blockBackground',
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
	},
	advanced: {
		template: 'advanced',
	},
};
const customCss = {
	selectors: {
		...createSelectors({
			slide: '',
		}),
	},
	categories: [
		'slide',
		'before slide',
		'after slide',
		'background',
		'background hover',
	],
};
const interactionBuilderSettings = getCanvasSettings({ name, customCss });

const data = {
	name,
	copyPasteMapping,
	customCss,
	interactionBuilderSettings,
};

export { copyPasteMapping, customCss, interactionBuilderSettings };
export default data;
