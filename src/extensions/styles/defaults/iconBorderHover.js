import hoverAttributesCreator from '@extensions/styles/hoverAttributesCreator';
import { iconBorder, iconBorderWidth, iconBorderRadius } from './iconBorder';

export const iconBorderHover = hoverAttributesCreator({
	obj: iconBorder,
});

export const iconBorderWidthHover = hoverAttributesCreator({
	obj: iconBorderWidth,
});

export const iconBorderRadiusHover = hoverAttributesCreator({
	obj: iconBorderRadius,
	diffValAttr: { 'icon-border-unit-radius-general-hover': 'px' },
});
