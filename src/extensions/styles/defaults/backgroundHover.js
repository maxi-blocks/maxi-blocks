import hoverAttributesCreator from '@extensions/styles/hoverAttributesCreator';
import {
	background,
	backgroundColor,
	backgroundImage,
	backgroundVideo,
	backgroundGradient,
	backgroundSVG,
} from './background';

export const backgroundHover = hoverAttributesCreator({
	obj: background,
	newAttr: {
		'background-status-hover': {
			type: 'boolean',
			default: false,
		},
	},
});

export const backgroundColorHover = hoverAttributesCreator({
	obj: backgroundColor,
	sameValAttr: ['background-palette-status-general'],
	diffValAttr: { 'background-palette-color-general': 6 },
});

export const backgroundImageHover = hoverAttributesCreator({
	obj: backgroundImage,
});

export const backgroundVideoHover = hoverAttributesCreator({
	obj: backgroundVideo,
});

export const backgroundGradientHover = hoverAttributesCreator({
	obj: backgroundGradient,
});

export const backgroundSVGHover = hoverAttributesCreator({
	obj: backgroundSVG,
	sameValAttr: ['background-svg-palette-status-general'],
	diffValAttr: { 'background-svg-palette-color-general': 6 },
});
