/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { createSelectors } from '@extensions/styles/custom-css';
import { getCanvasSettings, getAdvancedSettings } from '@extensions/relations';
import { createIconTransitions } from '@extensions/styles';
import transitionDefault from '@extensions/styles/transitions/transitionDefault';

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
	selectors: {
		...createSelectors({
			row: '',
		}),
		...createSelectors(
			{
				'first arrow': ' .maxi-row-carousel__arrow--prev',
				'second arrow': ' .maxi-row-carousel__arrow--next',
				'all dots': ' .maxi-row-carousel__dots',
				'each dot': ' .maxi-row-carousel__dot',
			},
			false
		),
		'first arrow icon': {
			normal: {
				label: __('first arrow icon', 'maxi-blocks'),
				target: ' .maxi-row-carousel__arrow--prev svg',
			},
			hover: {
				label: __('first arrow icon on hover', 'maxi-blocks'),
				target: ' .maxi-row-carousel__arrow--prev:hover svg',
			},
		},
		'second arrow icon': {
			normal: {
				label: __('second arrow icon', 'maxi-blocks'),
				target: ' .maxi-row-carousel__arrow--next svg',
			},
			hover: {
				label: __('second arrow icon on hover', 'maxi-blocks'),
				target: ' .maxi-row-carousel__arrow--next:hover svg',
			},
		},
		'dot icon': {
			normal: {
				label: __('Each dot icon', 'maxi-blocks'),
				target: ' .maxi-row-carousel__dot svg',
			},
			hover: {
				label: __('Each dot icon on hover', 'maxi-blocks'),
				target: ' .maxi-row-carousel__dot:hover svg',
			},
		},
	},
	categories: [
		'row',
		'before row',
		'after row',
		'background',
		'background hover',
		'first arrow',
		'second arrow',
		'first arrow icon',
		'second arrow icon',
		'all dots',
		'each dot',
		'dot icon',
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

const inlineStylesTargets = {
	block: '',
};

const attributesToStyles = {
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

const transition = {
	...transitionDefault,
	block: {
		...transitionDefault.canvas,
		...createIconTransitions({
			target: '.maxi-row-carousel__arrow',
			prefix: 'navigation-arrow-both-icon-',
			titlePrefix: 'arrow',
		}),
		...createIconTransitions({
			target: '.maxi-row-carousel__dot',
			prefix: 'navigation-dot-icon-',
			titlePrefix: 'dot',
		}),
	},
};

const data = {
	name,
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	maxiAttributes,
	attributesToStyles,
};

export {
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	maxiAttributes,
	ariaLabelsCategories,
	attributesToStyles,
};
export default data;
