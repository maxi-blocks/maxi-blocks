import hoverAttributesCreator from '../hoverAttributesCreator';
import { border, borderWidth, borderRadius } from './border';

export const borderHover = hoverAttributesCreator({
	obj: border,
	sameValAttr: ['border-past-general'],
	diffValAttr: { 'border-pac-general': 6 },
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
});
