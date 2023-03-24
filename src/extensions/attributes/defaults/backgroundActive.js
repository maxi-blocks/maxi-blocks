import attributesShorter from '../dictionary/attributesShorter';
import prefixAttributesCreator from '../prefixAttributesCreator';
import {
	background,
	backgroundColor,
	backgroundImage,
	backgroundVideo,
	backgroundGradient,
	backgroundSVG,
} from './background';

const prefix = 'active-';

export const backgroundActive = attributesShorter(
	prefixAttributesCreator({
		obj: background,
		newAttr: {
			'background-status-active': {
				type: 'boolean',
				default: false,
			},
		},
		prefix,
	}),
	'backgroundActive'
);

export const backgroundColorActive = attributesShorter(
	prefixAttributesCreator({
		obj: backgroundColor,
		diffValAttr: { [`${prefix}background-palette-color-general`]: 6 },
		prefix,
	}),
	'backgroundColorActive'
);

export const backgroundImageActive = attributesShorter(
	prefixAttributesCreator({
		obj: backgroundImage,
		prefix,
	}),
	'backgroundImageActive'
);

export const backgroundVideoActive = attributesShorter(
	prefixAttributesCreator({
		obj: backgroundVideo,
		prefix,
	}),
	'backgroundVideoActive'
);

export const backgroundGradientActive = attributesShorter(
	prefixAttributesCreator({
		obj: backgroundGradient,
		prefix,
	}),
	'backgroundGradientActive'
);

export const backgroundSVGActive = attributesShorter(
	prefixAttributesCreator({
		obj: backgroundSVG,
		diffValAttr: { [`${prefix}background-svg-palette-color-general`]: 6 },
		prefix,
	}),
	'backgroundSVGActive'
);
