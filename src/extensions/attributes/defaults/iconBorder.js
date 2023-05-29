import prefixAttributesCreator from '../prefixAttributesCreator';
import { border, borderWidth, borderRadius } from './border';

const prefix = 'i-';
const longPrefix = 'icon-';

export const iconBorder = prefixAttributesCreator({
	obj: border,
	prefix,
	longPrefix,
});

export const iconBorderWidth = prefixAttributesCreator({
	obj: borderWidth,
	prefix,
	longPrefix,
});

export const iconBorderRadius = prefixAttributesCreator({
	obj: borderRadius,
	prefix,
	longPrefix,
	diffValAttr: { 'i-bo.ra.u-g': 'px' }, // icon-border-radius-unit-g
});
