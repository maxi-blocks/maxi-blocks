/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Internal dependencies
 */
import BoxShadowControl from '@components/box-shadow-control';
import DividerControl from '@components/divider-control';
import { createSelectors } from '@extensions/styles/custom-css';
import {
	getBoxShadowStyles,
	getDividerStyles,
} from '@extensions/styles/helpers';
import { getCanvasSettings, getAdvancedSettings } from '@extensions/relations';
import transitionDefault from '@extensions/styles/transitions/transitionDefault';
import { getPaletteAttributes } from '@extensions/styles';

/**
 * Classnames
 */
const dividerWrapperClass = ' .maxi-divider-block';
const dividerClass = `${dividerWrapperClass}__divider`;

const prefix = 'divider-';

/**
 * Data object
 */
const name = 'divider-maxi';
const copyPasteMapping = {
	settings: {
		[__('Alignment', 'maxi-blocks')]: {
			group: {
				[__('Line orientation', 'maxi-blocks')]: 'line-orientation',
				[__('Line vertical position', 'maxi-blocks')]: 'line-vertical',
				[__('Line horizontal position', 'maxi-blocks')]:
					'line-horizontal',
			},
			hasBreakpoints: true,
		},
		[__('Line settings', 'maxi-blocks')]: {
			group: {
				[__('Line style', 'maxi-blocks')]: 'divider-border-style',
				[__('Line colour', 'maxi-blocks')]: {
					props: 'divider-border',
					isPalette: true,
				},
				[__('Line size', 'maxi-blocks')]: [
					'divider-height',
					'divider-width',
				],
				[__('Line weight', 'maxi-blocks')]: [
					'divider-border-top-width',
					'divider-border-top-unit',
					'divider-border-right-width',
					'divider-border-right-unit',
				],
			},
			hasBreakpoints: true,
		},
		[__('Box shadow', 'maxi-blocks')]: {
			template: 'boxShadow',
			prefix: 'divider-',
		},
	},
	canvas: {
		[__('Size', 'maxi-blocks')]: {
			template: 'size',
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
		[__('Opacity', 'maxi-blocks')]: {
			template: 'opacity',
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
			canvas: '',
			divider: dividerClass,
		}),
	},
	categories: [
		'canvas',
		'before canvas',
		'after canvas',
		'divider',
		'before divider',
		'after divider',
		'background',
		'background hover',
	],
};
const ariaLabelsCategories = ['canvas', 'divider'];
const transition = {
	...transitionDefault,
	block: {
		'box shadow': {
			title: __('Box shadow', 'maxi-blocks'),
			target: dividerClass,
			property: 'box-shadow',
			hoverProp: `${prefix}box-shadow-status-hover`,
		},
	},
};
const interactionBuilderSettings = {
	block: [
		{
			sid: 'dbs',
			label: __('Divider box shadow', 'maxi-blocks'),
			transitionTarget: transition.block['box shadow'].target,
			hoverProp: 'divider-box-shadow-status-hover',
			attrGroupName: 'boxShadow',
			prefix: 'divider-',
			component: props => <BoxShadowControl {...props} />,
			helper: props => getBoxShadowStyles(props),
			target: dividerClass,
			relatedAttributes: [
				'box-shadow-inset',
				'box-shadow-horizontal',
				'box-shadow-horizontal-unit',
				'box-shadow-vertical',
				'box-shadow-vertical-unit',
				'box-shadow-blur',
				'box-shadow-blur-unit',
				'box-shadow-spread',
				'box-shadow-spread-unit',
			],
			forceTempPalette: (attributes, breakpoint, IBAttributes) => {
				const paletteAttributes = getPaletteAttributes({
					obj: IBAttributes,
					prefix: 'box-shadow-',
					breakpoint,
				});

				return Object.values(paletteAttributes).every(attr =>
					isNil(attr)
				);
			},
			forceTempPalettePrefix: 'box-shadow-',
		},
		{
			sid: 'dls',
			label: __('Line settings', 'maxi-blocks'),
			attrGroupName: ['divider', 'size'],
			component: props => <DividerControl {...props} />,
			helper: props =>
				getDividerStyles(props.obj, 'line', props.blockStyle),
			target: dividerClass,
			styleAttrs: ['line-orientation', 'divider-border-style'],
		},
	],
	canvas: getCanvasSettings({ name }),
	advanced: getAdvancedSettings({ customCss }),
};

const data = {
	name,
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
};

export {
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	ariaLabelsCategories,
};
export default data;
