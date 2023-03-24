import attributesShorter from '../dictionary/attributesShorter';
import hoverAttributesCreator from '../hoverAttributesCreator';
import { border, borderWidth, borderRadius } from './border';

export const borderHover = attributesShorter(
	hoverAttributesCreator({
		obj: border,
		sameValAttr: ['border-pa-status-general'],
		diffValAttr: { 'border-palette-color-general': 6 },
		newAttr: {
			'border-status-hover': {
				type: 'boolean',
				default: false,
			},
		},
	}),
	'borderHover'
);

export const borderWidthHover = attributesShorter(
	hoverAttributesCreator({
		obj: borderWidth,
	}),
	'borderWidthHover'
);

export const borderRadiusHover = attributesShorter(
	hoverAttributesCreator({
		obj: borderRadius,
	}),
	'borderRadiusHover'
);
