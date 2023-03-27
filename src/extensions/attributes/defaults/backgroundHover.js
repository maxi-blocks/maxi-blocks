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
		'b.sh': {
			type: 'boolean',
			default: false,
			longLabel: 'background-status-hover',
		},
	},
});

export const backgroundColorHover = hoverAttributesCreator({
	obj: backgroundColor,
	sameValAttr: ['b-ps-general'], // background-palette-status-general
	diffValAttr: { 'b-pc-general': 6 }, // background-palette-color-general
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
	sameValAttr: ['bs-ps-general'], // background-svg-palette-status-general
	diffValAttr: { 'bs-pc-general': 6 }, // background-svg-palette-color-general
});
