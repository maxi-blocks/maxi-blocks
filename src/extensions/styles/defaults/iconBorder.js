import prefixAttributesCreator from '@extensions/styles/prefixAttributesCreator';
import { border, borderWidth, borderRadius } from './border';

const prefix = 'icon-';

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
	diffValAttr: { 'icon-border-unit-radius-general': 'px' },
});
