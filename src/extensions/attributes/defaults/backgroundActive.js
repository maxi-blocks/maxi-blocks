import prefixAttributesCreator from '../prefixAttributesCreator';
import {
	background,
	backgroundColor,
	backgroundImage,
	backgroundVideo,
	backgroundGradient,
	backgroundSVG,
} from './background';

const prefix = 'a-';
const longPrefix = 'active-';

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
	longPrefix,
});

export const backgroundColorActive = prefixAttributesCreator({
	obj: backgroundColor,
	diffValAttr: { [`${prefix}b_pc-general`]: 6 }, // background-palette-color-general
	prefix,
	longPrefix,
});

export const backgroundImageActive = prefixAttributesCreator({
	obj: backgroundImage,
	prefix,
	longPrefix,
});

export const backgroundVideoActive = prefixAttributesCreator({
	obj: backgroundVideo,
	prefix,
	longPrefix,
});

export const backgroundGradientActive = prefixAttributesCreator({
	obj: backgroundGradient,
	prefix,
	longPrefix,
});

export const backgroundSVGActive = prefixAttributesCreator({
	obj: backgroundSVG,
	diffValAttr: { [`${prefix}bs_pc-general`]: 6 }, // background-svg-palette-color-general
	prefix,
	longPrefix,
});
