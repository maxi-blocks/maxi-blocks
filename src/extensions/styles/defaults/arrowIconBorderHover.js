import hoverAttributesCreator from '../hoverAttributesCreator';
import {
	arrowIconBorder,
	arrowIconBorderWidth,
	arrowIconBorderRadius,
} from './arrowIconBorder';

export const arrowIconBorderHover = hoverAttributesCreator({
	obj: arrowIconBorder,
});

export const arrowIconBorderWidthHover = hoverAttributesCreator({
	obj: arrowIconBorderWidth,
});

export const arrowIconBorderRadiusHover = hoverAttributesCreator({
	obj: arrowIconBorderRadius,
	diffValAttr: {
		'navigation-arrow-both-icon-border-unit-radius-general-hover': 'px',
	},
});
