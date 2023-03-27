import prefixAttributesCreator from '../prefixAttributesCreator';
import { border, borderWidth, borderRadius } from './border';

const prefix = 'i-'; // icon-

export const iconBorder = prefixAttributesCreator({
	obj: border,
	prefix,
});

export const iconBorderWidth = prefixAttributesCreator({
	obj: borderWidth,
	prefix,
});

export const iconBorderRadius = prefixAttributesCreator({
	obj: borderRadius,
	prefix,
	diffValAttr: { 'i-bo.ra.u-general': 'px' }, // icon-border-radius-unit-general
});
