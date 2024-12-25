import {
	getAdvancedSettings,
	getCanvasSettings,
} from '@extensions/relations';
import { createSelectors } from '@extensions/styles/custom-css';

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
const ariaLabelsCategories = ['slide'];
const interactionBuilderSettings = {
	block: getCanvasSettings({ name }),
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
