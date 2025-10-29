import { getAdvancedSettings, getCanvasSettings } from '@extensions/relations';
import { createSelectors } from '@extensions/styles/custom-css';

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
		'Slider settings': {
			group: {
				'Edit view': 'isEditView',
				Loop: 'isLoop',
				Autoplay: 'isAutoplay',
				'Pause on hover': 'pauseOnHover',
				'Pause on interaction': 'pauseOnInteraction',
				'Autoplay speed': 'slider-autoplay-speed',
				'Transition type': 'slider-transition',
				'Transition speed': 'slider-transition-speed',
			},
		},
		Navigation: {
			group: {
				'Enable arrows': 'navigation-arrow-both-status',
				'Enable dots': 'navigation-dot-status',
				'Arrows position': 'navigation-arrow-position',
				'Dots position': 'navigation-dot-position',
			},
			hasBreakpoints: true,
		},
		Arrows: {
			group: {
				'Arrow icons': {
					groupAttributes: 'arrowIcon',
				},
				'Arrow icons - hover': {
					groupAttributes: 'arrowIconHover',
				},
			},
		},
		Dots: {
			group: {
				'Dot icons': {
					groupAttributes: 'dotIcon',
				},
				'Dot icons - hover': {
					groupAttributes: 'dotIconHover',
				},
				'Dot icons - active': {
					groupAttributes: 'dotIconActive',
				},
			},
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
				label: 'first arrow icon',
				target: ' .maxi-slider-block__arrow--prev svg',
			},
			hover: {
				label: 'first arrow icon on hover',
				target: ' .maxi-slider-block__arrow--prev:hover svg',
			},
		},
		'second arrow icon': {
			normal: {
				label: 'second arrow icon',
				target: ' .maxi-slider-block__arrow--next svg',
			},
			hover: {
				label: 'second arrow icon on hover',
				target: ' .maxi-slider-block__arrow--next:hover svg',
			},
		},
		'dot icon': {
			normal: {
				label: 'Each dot icon',
				target: ' .maxi-slider-block__dot svg',
			},
			hover: {
				label: 'Each dot icon on hover',
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

const inlineStylesTargets = {
	block: '',
	firstArrow: ' .maxi-slider-block__arrow--prev',
	secondArrow: ' .maxi-slider-block__arrow--next',
	arrows: ' .maxi-slider-block__arrow',
	arrowsIcon: ' .maxi-slider-block__arrow svg',
	allDots: ' .maxi-slider-block__dots',
	eachDot: ' .maxi-slider-block__dot',
	activeDot: ' .maxi-slider-block__dot--active',
	firstArrowIcon: ' .maxi-slider-block__arrow--prev svg',
	secondArrowIcon: ' .maxi-slider-block__arrow--next svg',
	dotIcon: ' .maxi-slider-block__dot svg',
	arrowIconPath: ' .maxi-slider-block__arrow svg path',
	dotIconPath: ' .maxi-slider-block__dot svg path',
	activeDotIconPath: ' .maxi-slider-block__dot--active svg path',
};

const attributesToStyles = {
	'navigation-arrow-both-icon-stroke': {
		target: inlineStylesTargets.arrowIconPath,
		property: 'stroke-width',
		isMultiplySelector: true,
	},
	'navigation-arrow-both-icon-border-top-left-radius': {
		target: inlineStylesTargets.arrows,
		property: 'border-top-left-radius',
		isMultiplySelector: true,
	},
	'navigation-arrow-both-icon-border-top-right-radius': {
		target: inlineStylesTargets.arrows,
		property: 'border-top-right-radius',
		isMultiplySelector: true,
	},
	'navigation-arrow-both-icon-border-bottom-right-radius': {
		target: inlineStylesTargets.arrows,
		property: 'border-bottom-right-radius',
		isMultiplySelector: true,
	},
	'navigation-arrow-both-icon-border-bottom-left-radius': {
		target: inlineStylesTargets.arrows,
		property: 'border-bottom-left-radius',
		isMultiplySelector: true,
	},
	'navigation-arrow-both-icon-border-top-width': {
		target: inlineStylesTargets.arrows,
		property: 'border-top-width',
		isMultiplySelector: true,
	},
	'navigation-arrow-both-icon-border-right-width': {
		target: inlineStylesTargets.arrows,
		property: 'border-right-width',
		isMultiplySelector: true,
	},
	'navigation-arrow-both-icon-border-bottom-width': {
		target: inlineStylesTargets.arrows,
		property: 'border-bottom-width',
		isMultiplySelector: true,
	},
	'navigation-arrow-both-icon-border-left-width': {
		target: inlineStylesTargets.arrows,
		property: 'border-left-width',
		isMultiplySelector: true,
	},
	'navigation-arrow-both-icon-padding-top': {
		target: inlineStylesTargets.arrows,
		property: 'padding-top',
		isMultiplySelector: true,
	},
	'navigation-arrow-both-icon-padding-right': {
		target: inlineStylesTargets.arrows,
		property: 'padding-right',
		isMultiplySelector: true,
	},
	'navigation-arrow-both-icon-padding-bottom': {
		target: inlineStylesTargets.arrows,
		property: 'padding-bottom',
		isMultiplySelector: true,
	},
	'navigation-arrow-both-icon-padding-left': {
		target: inlineStylesTargets.arrows,
		property: 'padding-left',
		isMultiplySelector: true,
	},
	'navigation-arrow-both-icon-spacing-vertical': {
		target: inlineStylesTargets.arrows,
		property: 'top',
		unit: '%',
		isMultiplySelector: true,
	},
	'navigation-dot-icon-stroke': {
		target: inlineStylesTargets.dotIconPath,
		property: 'stroke-width',
		isMultiplySelector: true,
	},
	'navigation-dot-icon-border-top-left-radius': {
		target: inlineStylesTargets.eachDot,
		property: 'border-top-left-radius',
		isMultiplySelector: true,
	},
	'navigation-dot-icon-border-top-right-radius': {
		target: inlineStylesTargets.eachDot,
		property: 'border-top-right-radius',
		isMultiplySelector: true,
	},
	'navigation-dot-icon-border-bottom-right-radius': {
		target: inlineStylesTargets.eachDot,
		property: 'border-bottom-right-radius',
		isMultiplySelector: true,
	},
	'navigation-dot-icon-border-bottom-left-radius': {
		target: inlineStylesTargets.eachDot,
		property: 'border-bottom-left-radius',
		isMultiplySelector: true,
	},
	'navigation-dot-icon-border-top-width': {
		target: inlineStylesTargets.eachDot,
		property: 'border-top-width',
		isMultiplySelector: true,
	},
	'navigation-dot-icon-border-right-width': {
		target: inlineStylesTargets.eachDot,
		property: 'border-right-width',
		isMultiplySelector: true,
	},
	'navigation-dot-icon-border-bottom-width': {
		target: inlineStylesTargets.eachDot,
		property: 'border-bottom-width',
		isMultiplySelector: true,
	},
	'navigation-dot-icon-border-left-width': {
		target: inlineStylesTargets.eachDot,
		property: 'border-left-width',
		isMultiplySelector: true,
	},
	'navigation-dot-icon-padding-top': {
		target: inlineStylesTargets.eachDot,
		property: 'padding-top',
		isMultiplySelector: true,
	},
	'navigation-dot-icon-padding-right': {
		target: inlineStylesTargets.eachDot,
		property: 'padding-right',
		isMultiplySelector: true,
	},
	'navigation-dot-icon-padding-bottom': {
		target: inlineStylesTargets.eachDot,
		property: 'padding-bottom',
		isMultiplySelector: true,
	},
	'navigation-dot-icon-padding-left': {
		target: inlineStylesTargets.eachDot,
		property: 'padding-left',
		isMultiplySelector: true,
	},
	'navigation-dot-icon-spacing-vertical': {
		target: inlineStylesTargets.allDots,
		property: 'top',
		unit: '%',
		isMultiplySelector: true,
	},
	'navigation-dot-icon-spacing-horizontal': {
		target: inlineStylesTargets.allDots,
		property: 'left',
		unit: '%',
		isMultiplySelector: true,
	},
	'navigation-dot-icon-spacing-between': {
		target: `${inlineStylesTargets.eachDot}:not(:last-child)`,
		property: 'margin-right',
		unit: 'px',
		isMultiplySelector: true,
	},
	'active-navigation-dot-icon-stroke': {
		target: inlineStylesTargets.activeDotIconPath,
		property: 'stroke-width',
	},
	'active-navigation-dot-icon-border-top-left-radius': {
		target: inlineStylesTargets.activeDot,
		property: 'border-top-left-radius',
	},
	'active-navigation-dot-icon-border-top-right-radius': {
		target: inlineStylesTargets.activeDot,
		property: 'border-top-right-radius',
	},
	'active-navigation-dot-icon-border-bottom-right-radius': {
		target: inlineStylesTargets.activeDot,
		property: 'border-bottom-right-radius',
	},
	'active-navigation-dot-icon-border-bottom-left-radius': {
		target: inlineStylesTargets.activeDot,
		property: 'border-bottom-left-radius',
	},
	'active-navigation-dot-icon-border-top-width': {
		target: inlineStylesTargets.activeDot,
		property: 'border-top-width',
	},
	'active-navigation-dot-icon-border-right-width': {
		target: inlineStylesTargets.activeDot,
		property: 'border-right-width',
	},
	'active-navigation-dot-icon-border-bottom-width': {
		target: inlineStylesTargets.activeDot,
		property: 'border-bottom-width',
	},
	'active-navigation-dot-icon-border-left-width': {
		target: inlineStylesTargets.activeDot,
		property: 'border-left-width',
	},
	'active-navigation-dot-icon-width': {
		target: inlineStylesTargets.activeDot,
		property: 'width',
		unit: '%',
	},
	'active-navigation-dot-icon-padding-top': {
		target: inlineStylesTargets.activeDot,
		property: 'padding-top',
	},
	'active-navigation-dot-icon-padding-right': {
		target: inlineStylesTargets.activeDot,
		property: 'padding-right',
	},
	'active-navigation-dot-icon-padding-bottom': {
		target: inlineStylesTargets.activeDot,
		property: 'padding-bottom',
	},
	'active-navigation-dot-icon-padding-left': {
		target: inlineStylesTargets.activeDot,
		property: 'padding-left',
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
	attributesToStyles,
};

export {
	copyPasteMapping,
	customCss,
	interactionBuilderSettings,
	ariaLabelsCategories,
	attributesToStyles,
};
export default data;
