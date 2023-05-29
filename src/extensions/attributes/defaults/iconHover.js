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
		'i-b_am-g.h': 'none', // icon-background-active-media-g-hover
	},
});

export const iconBackgroundColorHover = hoverAttributesCreator({
	obj: iconBackgroundColor,
	diffValAttr: {
		'i-b_pc-g.h': 6, // icon-background-palette-color-g-hover
	},
});

export const iconBackgroundGradientHover = hoverAttributesCreator({
	obj: iconBackgroundGradient,
	diffValAttr: {
		'i-bg_o-g.h': 1, // icon-background-gradient-opacity-g-hover
	},
});
