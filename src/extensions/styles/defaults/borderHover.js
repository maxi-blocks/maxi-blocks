import hoverAttributesCreator from '../hoverAttributesCreator';
import { border, borderWidth, borderRadius } from './border';

export const borderHover = hoverAttributesCreator({
	obj: border,
	sameValAttr: ['border-palette-status-general'],
	diffValAttr: { 'border-palette-color-general': 6 },
	newAttr: {
		'border-status-hover': {
			type: 'boolean',
			default: false,
		},
	},
});

export const borderWidthHover = hoverAttributesCreator({
	obj: borderWidth,
});

export const borderRadiusHover = hoverAttributesCreator({
	obj: borderRadius,
	diffValAttr: { 'border-unit-radius-general-hover': 'px' },
});
