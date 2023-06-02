/**
 * Internal dependencies
 */
import { createSelectors } from '../../extensions/attributes/custom-css';
import {
	getCanvasSettings,
	getAdvancedSettings,
} from '../../extensions/relations';

/**
 * Data object
 */
const name = 'group-maxi';
const copyPasteMapping = {
	settings: {
		'Callout arrow': {
			group: {
				'Show arrow': 'ar.s',
				'Arrow side': 'ar_sid',
				'Arrow position': 'ar_pos',
				'Arrow size': 'ar_w',
			},
			hasBreakpoints: true,
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
		Size: {
			template: 'size',
		},
		'Margin/Padding': {
			template: 'marginPadding',
		},
	},
	advanced: {
		template: 'advanced',
		Opacity: {
			template: 'opacity',
		},
	},
};
const customCss = {
	selectors: createSelectors({
		g: '',
	}),
	categories: ['g', 'be g', 'a g', 'bg', 'bg h'],
};
const interactionBuilderSettings = {
	canvas: getCanvasSettings({ name }),
	advanced: getAdvancedSettings({ customCss }),
};

const data = {
	name,
	copyPasteMapping,
	customCss,
	interactionBuilderSettings,
};

export { copyPasteMapping, customCss, interactionBuilderSettings };
export default data;
