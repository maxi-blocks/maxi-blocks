import hoverAttributesCreator from '../hoverAttributesCreator';
import {
	dotIcon,
	dotIconBackground,
	dotIconBackgroundColor,
	dotIconBackgroundGradient,
} from './dotIcon';

export const dotIconHover = hoverAttributesCreator({
	obj: dotIcon,
	newAttr: {
		'navigation-dot-icon-status-hover': {
			type: 'boolean',
			default: false,
		},
		'navigation-dot-icon-stroke-palette-status-hover': {
			type: 'boolean',
			default: true,
		},
		'navigation-dot-icon-fill-palette-status-hover': {
			type: 'boolean',
			default: true,
		},
		'navigation-dot-icon-stroke-palette-color-hover': {
			type: 'number',
			default: 2,
		},
		'navigation-dot-icon-fill-palette-color-hover': {
			type: 'number',
			default: 6,
		},
	},
});

export const dotIconBackgroundHover = hoverAttributesCreator({
	obj: dotIconBackground,
	diffValAttr: {
		'navigation-dot-icon-background-active-media-general-hover': 'none',
	},
});

export const dotIconBackgroundColorHover = hoverAttributesCreator({
	obj: dotIconBackgroundColor,
	diffValAttr: {
		'navigation-dot-icon-background-palette-color-general-hover': 6,
	},
});

export const dotIconBackgroundGradientHover = hoverAttributesCreator({
	obj: dotIconBackgroundGradient,
	diffValAttr: {
		'navigation-dot-icon-background-gradient-opacity-general-hover': 1,
	},
});
