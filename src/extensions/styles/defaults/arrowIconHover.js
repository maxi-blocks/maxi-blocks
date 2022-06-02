import hoverAttributesCreator from '../hoverAttributesCreator';
import {
	arrowIcon,
	arrowIconBackground,
	arrowIconBackgroundColor,
	arrowIconBorder,
	arrowIconBorderWidth,
	arrowIconBorderRadius,
} from './arrowIcon';

export const arrowIconHover = hoverAttributesCreator({
	obj: arrowIcon,
	diffValAttr: {
		'navigation-arrow-first-stroke-palette-color-hover': 6,
		'navigation-arrow-first-fill-palette-color-hover': 2,
		'navigation-arrow-first-width-general': '',
		'navigation-arrow-first-stroke-general': '',
		'navigation-arrow-second-stroke-palette-color-hover': 6,
		'navigation-arrow-second-fill-palette-color-hover': 2,
		'navigation-arrow-second-width-general': '',
		'navigation-arrow-second-stroke-general': '',
		'navigation-arrow-both-stroke-palette-color-hover': 6,
		'navigation-arrow-both-fill-palette-color-hover': 2,
		'navigation-arrow-both-width-general': '',
		'navigation-arrow-both-stroke-general': '',
	},
	newAttr: {
		'navigation-arrow-first-status-hover': {
			type: 'boolean',
			default: false,
		},
		'navigation-arrow-first-stroke-palette-status-hover': {
			type: 'boolean',
			default: true,
		},
		'navigation-arrow-first-fill-palette-status-hover': {
			type: 'boolean',
			default: true,
		},
		'navigation-arrow-second-status-hover': {
			type: 'boolean',
			default: false,
		},
		'navigation-arrow-second-stroke-palette-status-hover': {
			type: 'boolean',
			default: true,
		},
		'navigation-arrow-second-fill-palette-status-hover': {
			type: 'boolean',
			default: true,
		},
		'navigation-arrow-both-status-hover': {
			type: 'boolean',
			default: false,
		},
		'navigation-arrow-both-stroke-palette-status-hover': {
			type: 'boolean',
			default: true,
		},
		'navigation-arrow-both-fill-palette-status-hover': {
			type: 'boolean',
			default: true,
		},
	},
});

export const arrowIconBackgroundHover = hoverAttributesCreator({
	obj: arrowIconBackground,
	diffValAttr: {
		'navigation-arrow-first-background-active-media-general-hover': 'none',
		'navigation-arrow-second-background-active-media-general-hover': 'none',
		'navigation-arrow-both-background-active-media-general-hover': 'none',
	},
});

export const arrowIconBackgroundColorHover = hoverAttributesCreator({
	obj: arrowIconBackgroundColor,
	diffValAttr: {
		'navigation-arrow-first-background-palette-color-general-hover': 6,
		'navigation-arrow-second-background-palette-color-general-hover': 6,
		'navigation-arrow-both-background-palette-color-general-hover': 6,
	},
});

export const arrowIconBackgroundGradientHover = hoverAttributesCreator({
	obj: arrowIconBackgroundColor,
	diffValAttr: {
		'navigation-arrow-first-background-gradient-opacity-general-hover': 1,
		'navigation-arrow-second-background-gradient-opacity-general-hover': 1,
		'navigation-arrow-both-background-gradient-opacity-general-hover': 1,
	},
});

export const arrowIconBorderHover = hoverAttributesCreator({
	obj: arrowIconBorder,
});

export const arrowIconBorderWidthHover = hoverAttributesCreator({
	obj: arrowIconBorderWidth,
});

export const arrowIconBorderRadiusHover = hoverAttributesCreator({
	obj: arrowIconBorderRadius,
	diffValAttr: {
		'navigation-arrow-first-unit-radius-general-hover': 'px',
		'navigation-arrow-second-unit-radius-general-hover': 'px',
		'navigation-arrow-both-unit-radius-general-hover': 'px',
	},
});
