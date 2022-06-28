import prefixAttributesCreator from '../prefixAttributesCreator';
import { border, borderWidth, borderRadius } from './border';

const prefix = 'navigation-arrow-both-icon-';

export const arrowIconBorder = prefixAttributesCreator({
	obj: border,
	prefix,
});

export const arrowIconBorderWidth = prefixAttributesCreator({
	obj: borderWidth,
	prefix,
});

export const arrowIconBorderRadius = prefixAttributesCreator({
	obj: borderRadius,
	prefix,
	diffValAttr: {
		'navigation-arrow-both-icon-border-unit-radius-general': 'px',
	},
});
