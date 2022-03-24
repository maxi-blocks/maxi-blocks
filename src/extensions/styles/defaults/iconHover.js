import hoverAttributesCreator from '../hoverAttributesCreator';
import { icon, iconBackground, iconBackgroundColor } from './icon';

export const iconHover = hoverAttributesCreator({
	obj: icon,
	diffValAttr: {
		'icon-palette-color-hover': 6,
		'icon-width-general': '',
		'icon-stroke-general': '',
	},
	sameValAttr: ['icon-palette-status', 'icon-palette-color'],
	newAttr: {
		'icon-status-hover': {
			type: 'boolean',
			default: false,
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
	obj: iconBackgroundColor,
	diffValAttr: {
		'icon-background-gradient-opacity-general-hover': 1,
	},
});
