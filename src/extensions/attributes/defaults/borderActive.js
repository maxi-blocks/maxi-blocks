import attributesShorter from '../dictionary/attributesShorter';
import prefixAttributesCreator from '../prefixAttributesCreator';
import { border, borderWidth, borderRadius } from './border';

const prefix = 'active-';

export const borderActive = attributesShorter(
	prefixAttributesCreator({
		obj: border,
		diffValAttr: { [`${prefix}border-palette-color-general`]: 6 },
		newAttr: {
			'border-status-active': {
				type: 'boolean',
				default: false,
			},
		},
		prefix,
	}),
	'borderActive'
);

export const borderWidthActive = attributesShorter(
	prefixAttributesCreator({
		obj: borderWidth,
		prefix,
	}),
	'borderWidthActive'
);

export const borderRadiusActive = attributesShorter(
	prefixAttributesCreator({
		obj: borderRadius,
		prefix,
	}),
	'borderRadiusActive'
);
