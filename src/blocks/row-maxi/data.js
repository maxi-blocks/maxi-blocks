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
const name = 'row-maxi';
const copyPasteMapping = {
	settings: {
		'Row settings': {
			group: {
				'Row pattern': 'row-pattern',
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
const ariaLabelsCategories = ['row'];
const interactionBuilderSettings = {
	block: getCanvasSettings({ name }),
	advanced: getAdvancedSettings({ customCss }),
};
const maxiAttributes = {
	'max-width-xxl': '1690',
	'max-width-xl': '1170',
	'max-width-l': '90',
	'max-width-unit-general': undefined,
	'max-width-unit-xxl': 'px',
	'max-width-unit-xl': 'px',
	'max-width-unit-l': '%',
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
	ariaLabelsCategories,
};
export default data;
