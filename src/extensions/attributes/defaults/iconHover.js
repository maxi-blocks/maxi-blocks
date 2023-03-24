import attributesShorter from '../dictionary/attributesShorter';
import hoverAttributesCreator from '../hoverAttributesCreator';
import {
	icon,
	iconBackground,
	iconBackgroundColor,
	iconBackgroundGradient,
} from './icon';

export const iconHover = attributesShorter(
	hoverAttributesCreator({
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
			'icon-stroke-pa-status-hover': {
				type: 'boolean',
				default: true,
			},
			'icon-fill-pa-status-hover': {
				type: 'boolean',
				default: true,
			},
		},
	}),
	'iconHover'
);

export const iconBackgroundHover = attributesShorter(
	hoverAttributesCreator({
		obj: iconBackground,
		diffValAttr: {
			'icon-background-active-media-general-hover': 'none',
		},
	}),
	'iconBackgroundHover'
);

export const iconBackgroundColorHover = attributesShorter(
	hoverAttributesCreator({
		obj: iconBackgroundColor,
		diffValAttr: {
			'icon-background-palette-color-general-hover': 6,
		},
	}),
	'iconBackgroundColorHover'
);

export const iconBackgroundGradientHover = attributesShorter(
	hoverAttributesCreator({
		obj: iconBackgroundGradient,
		diffValAttr: {
			'icon-background-gradient-o-general-hover': 1,
		},
	}),
	'iconBackgroundGradientHover'
);
