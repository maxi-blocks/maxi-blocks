import hoverAttributesCreator from '../hoverAttributesCreator';
import { border, borderWidth, borderRadius } from './border';

export const borderHover = hoverAttributesCreator({
	obj: border,
	sameValAttr: ['bo_ps-g'], // border-palette-status-g
	diffValAttr: { 'bo_pc-g': 6 }, // border-palette-color-g
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
