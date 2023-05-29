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
	sameValAttr: ['b_ps-g'], // background-palette-status-g
	diffValAttr: { 'b_pc-g': 6 }, // background-palette-color-g
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
	sameValAttr: ['bs_ps-g'], // background-svg-palette-status-g
	diffValAttr: { 'bs_pc-g': 6 }, // background-svg-palette-color-g
});
