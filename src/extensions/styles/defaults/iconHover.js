import hoverAttributesCreator from '@extensions/styles/hoverAttributesCreator';
import {
	icon,
	iconBackground,
	iconBackgroundColor,
	iconBackgroundGradient,
} from './icon';

export const iconHover = hoverAttributesCreator({
	obj: icon,
	diffValAttr: {
		'icon-stroke-palette-color': 6,
		'icon-fill-palette-color': 2,
	},
	newAttr: {
		'icon-status-hover': {
			type: 'boolean',
			default: false,
		},
		'icon-status-hover-target': {
			type: 'boolean',
			default: true,
		},
		'icon-stroke-palette-status-hover': {
			type: 'boolean',
			default: true,
		},
		'icon-fill-palette-status-hover': {
			type: 'boolean',
			default: true,
		},
	},
});

export const iconBackgroundHover = hoverAttributesCreator({
	obj: iconBackground,
	diffValAttr: {
		'icon-background-active-media-general-hover': 'none',
	},
});

export const iconBackgroundColorHover = hoverAttributesCreator({
	obj: iconBackgroundColor,
	diffValAttr: {
		'icon-background-palette-color-general-hover': 6,
	},
});

export const iconBackgroundGradientHover = hoverAttributesCreator({
	obj: iconBackgroundGradient,
	diffValAttr: {
		'icon-background-gradient-opacity-general-hover': 1,
	},
});
