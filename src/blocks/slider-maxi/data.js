import {
	getAdvancedSettings,
	getCanvasSettings,
} from '@extensions/relations';
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
