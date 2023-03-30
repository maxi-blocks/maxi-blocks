import hoverAttributesCreator from '../hoverAttributesCreator';
import { border, borderWidth, borderRadius } from './border';

export const borderHover = hoverAttributesCreator({
	obj: border,
	sameValAttr: ['bo_ps-general'], // border-palette-status-general
	diffValAttr: { 'bo_pc-general': 6 }, // border-palette-color-general
	newAttr: {
		'bo.sh': {
			type: 'boolean',
			default: false,
			longLabel: 'border-status-hover',
		},
	},
});

export const borderWidthHover = hoverAttributesCreator({
	obj: borderWidth,
});

export const borderRadiusHover = hoverAttributesCreator({
	obj: borderRadius,
});
