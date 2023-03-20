import attributesShorter from '../dictionary/attributesShorter';
import hoverAttributesCreator from '../hoverAttributesCreator';
import { iconBorder, iconBorderWidth, iconBorderRadius } from './iconBorder';

export const iconBorderHover = attributesShorter(
	hoverAttributesCreator({
		obj: iconBorder,
	}),
	'iconBorderHover'
);

export const iconBorderWidthHover = attributesShorter(
	hoverAttributesCreator({
		obj: iconBorderWidth,
	}),
	'iconBorderWidthHover'
);

export const iconBorderRadiusHover = attributesShorter(
	hoverAttributesCreator({
		obj: iconBorderRadius,
		diffValAttr: { 'icon-border-unit-radius-general-hover': 'px' },
	}),
	'iconBorderRadiusHover'
);
