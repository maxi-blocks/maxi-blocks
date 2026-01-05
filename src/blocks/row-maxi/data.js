/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { createSelectors } from '@extensions/styles/custom-css';
import { getCanvasSettings, getAdvancedSettings } from '@extensions/relations';

/**
 * Data object
 */
const name = 'row-maxi';
const copyPasteMapping = {
	settings: {
		[__('Row settings', 'maxi-blocks')]: {
			group: {
				[__('Row pattern', 'maxi-blocks')]: 'row-pattern',
				[__('Row gap', 'maxi-blocks')]: ['row-gap', 'row-gap-unit'],
				[__('Column gap', 'maxi-blocks')]: [
					'column-gap',
					'column-gap-unit',
				],
				[__('Flex wrap', 'maxi-blocks')]: 'flex-wrap',
			},
			hasBreakpoints: true,
		},
		[__('Background', 'maxi-blocks')]: {
			template: 'blockBackground',
		},
		[__('Border', 'maxi-blocks')]: {
			template: 'border',
		},
		[__('Box shadow', 'maxi-blocks')]: {
			template: 'boxShadow',
		},
		[__('Size', 'maxi-blocks')]: {
			template: 'size',
		},
		[__('Margin/Padding', 'maxi-blocks')]: {
			template: 'marginPadding',
		},
	},
	advanced: {
		template: 'advanced',
		[__('Opacity', 'maxi-blocks')]: {
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
