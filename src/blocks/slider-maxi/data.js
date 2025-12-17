/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getAdvancedSettings, getCanvasSettings } from '@extensions/relations';
import { createSelectors } from '@extensions/styles/custom-css';
import transitionDefault from '@extensions/styles/transitions/transitionDefault';

/**
 * Data object
 */
const name = 'slider-maxi';
const copyPasteMapping = {
	_exclude: [
		'active-navigation-dot-icon-content',
		'navigation-arrow-first-icon-content',
		'navigation-arrow-second-icon-content',
	],
	settings: {
		[__('Slider settings', 'maxi-blocks')]: {
			group: {
				[__('Edit view', 'maxi-blocks')]: 'isEditView',
				[__('Loop', 'maxi-blocks')]: 'isLoop',
				[__('Autoplay', 'maxi-blocks')]: 'isAutoplay',
				[__('Pause on hover', 'maxi-blocks')]: 'pauseOnHover',
				[__('Pause on interaction', 'maxi-blocks')]:
					'pauseOnInteraction',
				[__('Autoplay speed', 'maxi-blocks')]: 'slider-autoplay-speed',
				[__('Transition type', 'maxi-blocks')]: 'slider-transition',
				[__('Transition speed', 'maxi-blocks')]:
					'slider-transition-speed',
			},
		},
		[__('Navigation', 'maxi-blocks')]: {
			group: {
				[__('Enable arrows', 'maxi-blocks')]:
					'navigation-arrow-both-status',
				[__('Enable dots', 'maxi-blocks')]: 'navigation-dot-status',
				[__('Arrows position', 'maxi-blocks')]:
					'navigation-arrow-position',
				[__('Dots position', 'maxi-blocks')]: 'navigation-dot-position',
			},
			hasBreakpoints: true,
		},
		[__('Arrows', 'maxi-blocks')]: {
			group: {
				[__('Arrow icons', 'maxi-blocks')]: {
					groupAttributes: 'arrowIcon',
				},
				[__('Arrow icons - hover', 'maxi-blocks')]: {
					groupAttributes: 'arrowIconHover',
				},
			},
		},
		[__('Dots', 'maxi-blocks')]: {
			group: {
				[__('Dot icons', 'maxi-blocks')]: {
					groupAttributes: 'dotIcon',
				},
				[__('Dot icons - hover', 'maxi-blocks')]: {
					groupAttributes: 'dotIconHover',
				},
				[__('Dot icons - active', 'maxi-blocks')]: {
					groupAttributes: 'dotIconActive',
				},
			},
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
	},
};
const customCss = {
	selectors: {
		...createSelectors({
			slider: '',
		}),
		...createSelectors(
			{
				'first arrow': ' .maxi-slider-block__arrow--prev',
				'second arrow': ' .maxi-slider-block__arrow--next',
				'all dots': ' .maxi-slider-block__dots',
				'each dot': ' .maxi-slider-block__dot',
			},
			false
		),
		'first arrow icon': {
			normal: {
				label: __('first arrow icon', 'maxi-blocks'),
				target: ' .maxi-slider-block__arrow--prev svg',
			},
			hover: {
				label: __('first arrow icon on hover', 'maxi-blocks'),
				target: ' .maxi-slider-block__arrow--prev:hover svg',
			},
		},
		'second arrow icon': {
			normal: {
				label: __('second arrow icon', 'maxi-blocks'),
				target: ' .maxi-slider-block__arrow--next svg',
			},
			hover: {
				label: __('second arrow icon on hover', 'maxi-blocks'),
				target: ' .maxi-slider-block__arrow--next:hover svg',
			},
		},
		'dot icon': {
			normal: {
				label: __('Each dot icon', 'maxi-blocks'),
				target: ' .maxi-slider-block__dot svg',
			},
			hover: {
				label: __('Each dot icon on hover', 'maxi-blocks'),
				target: ' .maxi-slider-block__dot:hover svg',
			},
		},
	},
	categories: [
		'slider',
		'before slider',
		'after slider',
		'first arrow',
		'second arrow',
		'first arrow icon',
		'second arrow icon',
		'all dots',
		'dot',
		'dot icon',
	],
};
const ariaLabelsCategories = [
	'slider',
	'first arrow',
	'second arrow',
	'all dots',
	'dot',
];
const interactionBuilderSettings = {
	block: getCanvasSettings({ name }),
	advanced: getAdvancedSettings({ customCss }),
};

const transition = {
	...transitionDefault,
	block: {
		'arrow colour': {
			title: __('Arrow colour', 'maxi-blocks'),
// Match button-maxi pattern: target paths, transition all
			target: [
				' .maxi-slider-block__arrow--prev svg > *',
				' .maxi-slider-block__arrow--next svg > *',
			],
			property: false,
			hoverProp: 'navigation-arrow-both-icon-status-hover',
		},
		'dot colour': {
			title: __('Dot colour', 'maxi-blocks'),
			target: ' .maxi-slider-block__dot svg > *',
			property: false,
			hoverProp: 'navigation-dot-icon-status-hover',
		},
		'arrow size': {
			title: __('Arrow size', 'maxi-blocks'),
			target: [
				' .maxi-slider-block__arrow--prev svg',
				' .maxi-slider-block__arrow--next svg',
			],
			property: ['width', 'height'],
			hoverProp: 'navigation-arrow-both-icon-status-hover',
		},
		'dot size': {
			title: __('Dot size', 'maxi-blocks'),
			target: ' .maxi-slider-block__dot svg',
			property: ['width', 'height'],
			hoverProp: 'navigation-dot-icon-status-hover',
		},
	},
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
