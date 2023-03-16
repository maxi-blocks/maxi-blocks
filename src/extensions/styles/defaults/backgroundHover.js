import hoverAttributesCreator from '../hoverAttributesCreator';
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
	sameValAttr: ['background-pa-status-general'],
	diffValAttr: { 'background-pac-general': 6 },
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
	sameValAttr: ['background-svg-pa-status-general'],
	diffValAttr: { 'background-svg-pac-general': 6 },
});
