import hoverAttributesCreator from '../hoverAttributesCreator';
import { iconBorder, iconBorderWidth, iconBorderRadius } from './iconBorder';

export const iconBorderHover = hoverAttributesCreator({
	obj: iconBorder,
});

export const iconBorderWidthHover = hoverAttributesCreator({
	obj: iconBorderWidth,
});

export const iconBorderRadiusHover = hoverAttributesCreator({
	obj: iconBorderRadius,
	diffValAttr: { 'icon-iconBorder-unit-radius-general-hover': 'px' },
});
