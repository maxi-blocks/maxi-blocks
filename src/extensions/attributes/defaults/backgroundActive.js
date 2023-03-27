import prefixAttributesCreator from '../prefixAttributesCreator';
import {
	background,
	backgroundColor,
	backgroundImage,
	backgroundVideo,
	backgroundGradient,
	backgroundSVG,
} from './background';

const prefix = 'a-'; // active-

export const backgroundActive = prefixAttributesCreator({
	obj: background,
	newAttr: {
		'b.sa': {
			type: 'boolean',
			default: false,
			longLabel: 'background-status-active',
		},
	},
	prefix,
});

export const backgroundColorActive = prefixAttributesCreator({
	obj: backgroundColor,
	diffValAttr: { [`${prefix}b-pc-general`]: 6 }, // background-palette-color-general
	prefix,
});

export const backgroundImageActive = prefixAttributesCreator({
	obj: backgroundImage,
	prefix,
});

export const backgroundVideoActive = prefixAttributesCreator({
	obj: backgroundVideo,
	prefix,
});

export const backgroundGradientActive = prefixAttributesCreator({
	obj: backgroundGradient,
	prefix,
});

export const backgroundSVGActive = prefixAttributesCreator({
	obj: backgroundSVG,
	diffValAttr: { [`${prefix}bs-pc-general`]: 6 }, // background-svg-palette-color-general
	prefix,
});
