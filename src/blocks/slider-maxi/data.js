import { getCanvasSettings } from '../../extensions/relations';
import { createSelectors } from '../../extensions/attributes/custom-css';

/**
 * Data object
 */
const name = 'slider-maxi';
const copyPasteMapping = {
	_exclude: ['a-nd-i_c', 'naf-i_c', 'nas-i_c'],
	settings: {
		'Slider settings': {
			group: {
				'Edit view': '_iev',
				Loop: '_il',
				Autoplay: '_ia',
				'Pause on hover': '_poh',
				'Pause on interaction': '_poi',
				'Autoplay speed': '_sas',
				'Transition type': '_slt',
				'Transition speed': '_sts',
			},
		},
		Navigation: {
			group: {
				'Enable arrows': 'nab.s',
				'Enable dots': 'nd.s',
				'Arrows position': 'na_pos',
				'Dots position': 'nd_pos',
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
const interactionBuilderSettings = getCanvasSettings({ name, customCss });

const data = {
	name,
	copyPasteMapping,
	customCss,
	interactionBuilderSettings,
};

export { copyPasteMapping, customCss, interactionBuilderSettings };
export default data;
