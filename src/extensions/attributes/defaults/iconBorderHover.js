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
	diffValAttr: { 'i-bo.ra.u-g.h': 'px' }, // icon-border-radius-unit-g-hover
});
