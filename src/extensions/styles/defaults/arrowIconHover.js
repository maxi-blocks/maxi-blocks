import hoverAttributesCreator from '../hoverAttributesCreator';
import {
	arrowIcon,
	arrowIconBackground,
	arrowIconBackgroundColor,
	arrowIconBackgroundGradient,
} from './arrowIcon';

export const arrowIconHover = hoverAttributesCreator({
	obj: arrowIcon,
	newAttr: {
		'navigation-arrow-both-icon-status-hover': {
			type: 'boolean',
			default: false,
		},
		'navigation-arrow-both-icon-stroke-palette-status-hover': {
			type: 'boolean',
			default: true,
		},
		'navigation-arrow-both-icon-fill-palette-status-hover': {
			type: 'boolean',
			default: true,
		},
		'navigation-arrow-both-icon-stroke-palette-color-hover': {
			type: 'number',
			default: 6,
		},
		'navigation-arrow-both-icon-fill-palette-color-hover': {
			type: 'number',
			default: 2,
		},
	},
});

export const arrowIconBackgroundHover = hoverAttributesCreator({
	obj: arrowIconBackground,
	diffValAttr: {
		'navigation-arrow-both-icon-background-active-media-general-hover':
			'none',
	},
});

export const arrowIconBackgroundColorHover = hoverAttributesCreator({
	obj: arrowIconBackgroundColor,
	diffValAttr: {
		'navigation-arrow-both-icon-background-palette-color-general-hover': 6,
	},
});

export const arrowIconBackgroundGradientHover = hoverAttributesCreator({
	obj: arrowIconBackgroundGradient,
	diffValAttr: {
		'navigation-arrow-both-icon-background-gradient-opacity-general-hover': 1,
	},
});
