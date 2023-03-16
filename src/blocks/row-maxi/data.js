/**
 * Internal dependencies
 */
import { createSelectors } from '../../extensions/styles/custom-css';
import {
	getCanvasSettings,
	getAdvancedSettings,
} from '../../extensions/relations';

/**
 * Data object
 */
const name = 'row-maxi';
const copyPasteMapping = {
	settings: {
		'Row settings': {
			group: {
				'Row pattern': 'rp',
				'Row gap': ['row-gap', 'row-gap-unit'],
				'Column gap': ['column-gap', 'column-gap-unit'],
				'Flex wrap': 'flex-wrap',
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
		row: '',
	}),
	categories: [
		'row',
		'before row',
		'after row',
		'background',
		'background hover',
	],
};
const interactionBuilderSettings = {
	canvas: getCanvasSettings({ name }),
	advanced: getAdvancedSettings({ customCss }),
};
const maxiAttributes = {
	'mw-xxl': '1690',
	'mw-xl': '1170',
	'mw-l': '90',
	'mwu-general': undefined,
	'mwu-xxl': 'px',
	'mwu-xl': 'px',
	'mwu-l': '%',
};

const data = {
	name,
	copyPasteMapping,
	customCss,
	interactionBuilderSettings,
	maxiAttributes,
};

export {
	copyPasteMapping,
	customCss,
	interactionBuilderSettings,
	maxiAttributes,
};
export default data;
