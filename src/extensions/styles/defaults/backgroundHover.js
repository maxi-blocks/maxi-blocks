import hoverObjectCreator from '../hoverObjectCreator';
import {
	background,
	backgroundColor,
	backgroundImage,
	backgroundVideo,
	backgroundGradient,
	backgroundSVG,
} from './background';

export const backgroundHover = hoverObjectCreator({
	obj: background,
	newAttr: {
		'background-hover-status': {
			type: 'boolean',
			default: false,
		},
	},
});

export const backgroundColorHover = hoverObjectCreator({
	obj: backgroundColor,
	sameValAttr: ['background-palette-color-status-general'],
	diffValAttr: { 'background-palette-color-general': 6 },
});

export const backgroundImageHover = hoverObjectCreator({
	obj: backgroundImage,
});

export const backgroundVideoHover = hoverObjectCreator({
	obj: backgroundVideo,
});

export const backgroundGradientHover = hoverObjectCreator({
	obj: backgroundGradient,
});

export const backgroundSVGHover = hoverObjectCreator({
	obj: backgroundSVG,
	sameValAttr: ['background-palette-svg-color-status-general'],
	diffValAttr: { 'background-palette-svg-color-general': 6 },
});
