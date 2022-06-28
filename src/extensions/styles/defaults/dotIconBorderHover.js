import hoverAttributesCreator from '../hoverAttributesCreator';
import {
	dotIconBorder,
	dotIconBorderWidth,
	dotIconBorderRadius,
} from './dotIconBorder';

export const dotIconBorderHover = hoverAttributesCreator({
	obj: dotIconBorder,
});

export const dotIconBorderWidthHover = hoverAttributesCreator({
	obj: dotIconBorderWidth,
});

export const dotIconBorderRadiusHover = hoverAttributesCreator({
	obj: dotIconBorderRadius,
	diffValAttr: {
		'navigation-dot-icon-border-unit-radius-general-hover': 'px',
	},
});
