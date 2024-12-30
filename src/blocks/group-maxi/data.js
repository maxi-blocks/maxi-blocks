/**
 * Internal dependencies
 */
import { createSelectors } from '@extensions/styles/custom-css';
import {
	getCanvasSettings,
	getAdvancedSettings,
} from '@extensions/relations';

/**
 * Data object
 */
const name = 'group-maxi';
const copyPasteMapping = {
	settings: {
		'Callout arrow': {
			group: {
				'Show arrow': 'arrow-status',
				'Arrow side': 'arrow-side',
				'Arrow position': 'arrow-position',
				'Arrow size': 'arrow-width',
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
		group: '',
	}),
	categories: [
		'group',
		'before group',
		'after group',
		'background',
		'background hover',
	],
};
const ariaLabelsCategories = ['group'];
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

export {
	copyPasteMapping,
	customCss,
	interactionBuilderSettings,
	ariaLabelsCategories,
};
export default data;
