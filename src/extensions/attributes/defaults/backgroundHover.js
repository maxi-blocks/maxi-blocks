import attributesShorter from '../dictionary/attributesShorter';
import hoverAttributesCreator from '../hoverAttributesCreator';
import {
	background,
	backgroundColor,
	backgroundImage,
	backgroundVideo,
	backgroundGradient,
	backgroundSVG,
} from './background';

export const backgroundHover = attributesShorter(
	hoverAttributesCreator({
		obj: background,
		newAttr: {
			'background-status-hover': {
				type: 'boolean',
				default: false,
			},
		},
	}),
	'backgroundHover'
);

export const backgroundColorHover = attributesShorter(
	hoverAttributesCreator({
		obj: backgroundColor,
		sameValAttr: ['background-pa-status-general'],
		diffValAttr: { 'background-palette-color-general': 6 },
	}),
	'backgroundColorHover'
);

export const backgroundImageHover = attributesShorter(
	hoverAttributesCreator({
		obj: backgroundImage,
	}),
	'backgroundImageHover'
);

export const backgroundVideoHover = attributesShorter(
	hoverAttributesCreator({
		obj: backgroundVideo,
	}),
	'backgroundVideoHover'
);

export const backgroundGradientHover = attributesShorter(
	hoverAttributesCreator({
		obj: backgroundGradient,
	}),
	'backgroundGradientHover'
);

export const backgroundSVGHover = attributesShorter(
	hoverAttributesCreator({
		obj: backgroundSVG,
		sameValAttr: ['background-svg-pa-status-general'],
		diffValAttr: { 'background-svg-palette-color-general': 6 },
	}),
	'backgroundSVGHover'
);
