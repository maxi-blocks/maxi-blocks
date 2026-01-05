/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getAdvancedSettings, getCanvasSettings } from '@extensions/relations';
import { createSelectors } from '@extensions/styles/custom-css';

/**
 * Data object
 */
const name = 'slide-maxi';
const copyPasteMapping = {
	settings: {
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
