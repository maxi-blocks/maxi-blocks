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
 * External dependencies
 */
import { capitalize } from 'lodash';

const shapeDividerCopyPasteGenerator = position => {
	return {
		[`${capitalize(position)} shape divider`]: {
			group: {
				[__(
					'Divider status',
					'maxi-blocks'
				)]: `shape-divider-${position}-status`,
				[__(
					'Divider style',
					'maxi-blocks'
				)]: `shape-divider-${position}-shape-style`,
				[__(
					'Divider opacity',
					'maxi-blocks'
				)]: `shape-divider-${position}-opacity`,
				[__('Divider color', 'maxi-blocks')]: [
					`shape-divider-${position}-palette-color`,
					`shape-divider-${position}-color`,
					`shape-divider-${position}-palette-status`,
				],
				[__(
					'Divider height',
					'maxi-blocks'
				)]: `shape-divider-${position}-height`,
				[__(
					'Divider height unit',
					'maxi-blocks'
				)]: `shape-divider-${position}-height-unit`,
				[__(
					'Divider scroll effect',
					'maxi-blocks'
				)]: `shape-divider-${position}-effects-status`,
			},
		},
	};
};

/**
 * Data object
 */
const name = 'container-maxi';
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
		...shapeDividerCopyPasteGenerator('top'),
		...shapeDividerCopyPasteGenerator('bottom'),
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
			container: '',
		}),
		'top shape divider': {
			normal: {
				label: 'top shape divider',
				target: ' .maxi-shape-divider__top',
			},
			hover: {
				label: 'top shape divider on hover',
				target: ' .maxi-shape-divider__top:hover',
			},
		},
		'bottom shape divider': {
			normal: {
				label: 'bottom shape divider',
				target: ' .maxi-shape-divider__bottom',
			},
			hover: {
				label: 'bottom shape divider on hover',
				target: ' .maxi-shape-divider__bottom:hover',
			},
		},
	},
	categories: [
		'container',
		'before container',
		'after container',
		'top shape divider',
		'bottom shape divider',
		'background',
		'background hover',
	],
};
const ariaLabelsCategories = [
	'container',
	'top shape divider',
	'bottom shape divider',
];
const interactionBuilderSettings = {
	block: getCanvasSettings({ name }),
	advanced: getAdvancedSettings({ customCss }),
};
const maxiAttributes = {
	'max-width-xxl': '1690',
	'max-width-xl': '1170',
	'max-width-l': '90',
	'max-width-unit-xxl': 'px',
	'max-width-unit-xl': 'px',
	'max-width-unit-l': '%',
	'width-l': '1170',
	'width-m': '1000',
	'width-s': '700',
	'width-xs': '460',
	'width-unit-l': 'px',
};

const inlineStylesTargets = {
	block: '',
	topShapeDivider: ' .maxi-shape-divider__top',
	bottomShapeDivider: ' .maxi-shape-divider__bottom',
};

const attributesToStyles = {
	'shape-divider-top-height': {
		target: inlineStylesTargets.topShapeDivider,
		property: 'height',
	},
	'shape-divider-bottom-height': {
		target: inlineStylesTargets.bottomShapeDivider,
		property: 'height',
	},
	'shape-divider-top-opacity': {
		target: inlineStylesTargets.topShapeDivider,
		property: 'opacity',
	},
	'shape-divider-bottom-opacity': {
		target: inlineStylesTargets.bottomShapeDivider,
		property: 'opacity',
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
	interactionBuilderSettings,
	maxiAttributes,
	attributesToStyles,
};

export {
	copyPasteMapping,
	customCss,
	interactionBuilderSettings,
	maxiAttributes,
	ariaLabelsCategories,
	attributesToStyles,
};
export default data;
