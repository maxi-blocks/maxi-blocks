import hoverAttributesCreator from '../hoverAttributesCreator';
import {
	icon,
	iconBackground,
	iconBackgroundColor,
	iconBackgroundGradient,
} from './icon';

export const iconHover = hoverAttributesCreator({
	obj: icon,
	diffValAttr: {
		'icon-stroke-pac': 6,
		'icon-fill-pac': 2,
	},
	newAttr: {
		'icon-status-hover': {
			type: 'boolean',
			default: false,
		},
		'icon-stroke-past-hover': {
			type: 'boolean',
			default: true,
		},
		'icon-fill-past-hover': {
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
		'icon-background-pac-general-hover': 6,
	},
});

export const iconBackgroundGradientHover = hoverAttributesCreator({
	obj: iconBackgroundGradient,
	diffValAttr: {
		'icon-background-gradient-o-general-hover': 1,
	},
});
