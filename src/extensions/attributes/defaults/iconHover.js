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
		'i-str_pc': 6, // icon-stroke-palette-color
		'i-f_pc': 2, // icon-fill-palette-color
	},
	newAttr: {
		'i.sh': {
			type: 'boolean',
			default: false,
			longLabel: 'icon-status-hover',
		},
		'i-str_ps.h': {
			type: 'boolean',
			default: true,
			longLabel: 'icon-stroke-palette-status-hover',
		},
		'i-f_ps.h': {
			type: 'boolean',
			default: true,
			longLabel: 'icon-fill-palette-status-hover',
		},
	},
});

export const iconBackgroundHover = hoverAttributesCreator({
	obj: iconBackground,
	diffValAttr: {
		'i-b_am-general.h': 'none', // icon-background-active-media-general-hover
	},
});

export const iconBackgroundColorHover = hoverAttributesCreator({
	obj: iconBackgroundColor,
	diffValAttr: {
		'i-b_pc-general.h': 6, // icon-background-palette-color-general-hover
	},
});

export const iconBackgroundGradientHover = hoverAttributesCreator({
	obj: iconBackgroundGradient,
	diffValAttr: {
		'i-bg-o-general.h': 1, // icon-background-gradient-opacity-general-hover
	},
});
