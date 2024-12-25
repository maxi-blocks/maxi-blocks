import prefixAttributesCreator from '@extensions/styles/prefixAttributesCreator';
import {
	background,
	backgroundColor,
	backgroundImage,
	backgroundVideo,
	backgroundGradient,
	backgroundSVG,
} from './background';

const prefix = 'active-';

export const backgroundActive = prefixAttributesCreator({
	obj: background,
	newAttr: {
		'background-status-active': {
			type: 'boolean',
			default: false,
		},
	},
	prefix,
});

export const backgroundColorActive = prefixAttributesCreator({
	obj: backgroundColor,
	diffValAttr: { [`${prefix}background-palette-color-general`]: 6 },
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
	diffValAttr: { [`${prefix}background-svg-palette-color-general`]: 6 },
	prefix,
});
