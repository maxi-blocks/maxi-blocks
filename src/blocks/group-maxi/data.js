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
const name = 'group-maxi';
const copyPasteMapping = {
	settings: {
		[__('Callout arrow', 'maxi-blocks')]: {
			group: {
				[__('Show arrow', 'maxi-blocks')]: 'arrow-status',
				[__('Arrow side', 'maxi-blocks')]: 'arrow-side',
				[__('Arrow position', 'maxi-blocks')]: 'arrow-position',
				[__('Arrow size', 'maxi-blocks')]: 'arrow-width',
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
