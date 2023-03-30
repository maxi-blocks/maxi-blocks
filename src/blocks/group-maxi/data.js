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
				'Show arrow': 'a.s',
				'Arrow side': 'a.sid',
				'Arrow position': 'a.pos',
				'Arrow size': 'a.w',
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
