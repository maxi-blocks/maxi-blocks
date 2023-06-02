import { getCanvasSettings } from '../../extensions/relations';
import { createSelectors } from '../../extensions/attributes/custom-css';

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
			sl: '',
		}),
	},
	categories: ['sl', 'be sl', 'a sl', 'bg', 'bg h'],
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
