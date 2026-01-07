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

const inlineStylesTargets = {
	block: '',
	divider: ' hr.maxi-divider-block__divider',
};

const attributesToStyles = {
	'divider-border-top-width': {
		target: inlineStylesTargets.divider,
		property: 'border-top-width',
	},
	'divider-border-right-width': {
		target: inlineStylesTargets.divider,
		property: 'border-right-width',
	},
	'divider-width': {
		target: inlineStylesTargets.divider,
		property: 'width',
		unit: '%',
	},
	'divider-height': {
		target: inlineStylesTargets.divider,
		property: 'height',
		unit: '%',
	},
	'border-top-width': {
		target: inlineStylesTargets.block,
		property: 'border-top-width',
	},
	'border-right-width': {
		target: inlineStylesTargets.block,
		property: 'border-right-width',
	},
	'border-bottom-width': {
		target: inlineStylesTargets.block,
		property: 'border-bottom-width',
	},
	'border-left-width': {
		target: inlineStylesTargets.block,
		property: 'border-left-width',
	},
	'border-top-left-radius': {
		target: inlineStylesTargets.block,
		property: 'border-top-left-radius',
	},
	'border-top-right-radius': {
		target: inlineStylesTargets.block,
		property: 'border-top-right-radius',
	},
	'border-bottom-right-radius': {
		target: inlineStylesTargets.block,
		property: 'border-bottom-right-radius',
	},
	'border-bottom-left-radius': {
		target: inlineStylesTargets.block,
		property: 'border-bottom-left-radius',
	},
	opacity: {
		target: inlineStylesTargets.block,
		property: 'opacity',
	},
	'flex-grow': {
		target: inlineStylesTargets.block,
		property: 'flex-grow',
	},
	'flex-shrink': {
		target: inlineStylesTargets.block,
		property: 'flex-shrink',
	},
	'row-gap': {
		target: inlineStylesTargets.block,
		property: 'row-gap',
	},
	'column-gap': {
		target: inlineStylesTargets.block,
		property: 'column-gap',
	},
	order: {
		target: inlineStylesTargets.block,
		property: 'order',
	},
	'margin-top': {
		target: inlineStylesTargets.block,
		property: 'margin-top',
	},
	'margin-right': {
		target: inlineStylesTargets.block,
		property: 'margin-right',
	},
	'margin-bottom': {
		target: inlineStylesTargets.block,
		property: 'margin-bottom',
	},
	'margin-left': {
		target: inlineStylesTargets.block,
		property: 'margin-left',
	},
	'padding-top': {
		target: inlineStylesTargets.block,
		property: 'padding-top',
	},
	'padding-right': {
		target: inlineStylesTargets.block,
		property: 'padding-right',
	},
	'padding-bottom': {
		target: inlineStylesTargets.block,
		property: 'padding-bottom',
	},
	'padding-left': {
		target: inlineStylesTargets.block,
		property: 'padding-left',
	},
	'position-top': {
		target: inlineStylesTargets.block,
		property: 'top',
	},
	'position-right': {
		target: inlineStylesTargets.block,
		property: 'right',
	},
	'position-bottom': {
		target: inlineStylesTargets.block,
		property: 'bottom',
	},
	'position-left': {
		target: inlineStylesTargets.block,
		property: 'left',
	},
	width: {
		target: inlineStylesTargets.block,
		property: 'width',
	},
	height: {
		target: inlineStylesTargets.block,
		property: 'height',
	},
	'min-width': {
		target: inlineStylesTargets.block,
		property: 'min-width',
	},
	'min-height': {
		target: inlineStylesTargets.block,
		property: 'min-height',
	},
	'max-width': {
		target: inlineStylesTargets.block,
		property: 'max-width',
	},
	'max-height': {
		target: inlineStylesTargets.block,
		property: 'max-height',
	},
};

const data = {
	name,
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	attributesToStyles,
};

export {
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	ariaLabelsCategories,
	attributesToStyles,
};
export default data;
