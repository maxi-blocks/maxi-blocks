import attributesShorter from '../dictionary/attributesShorter';
import prefixAttributesCreator from '../prefixAttributesCreator';
import { border, borderWidth, borderRadius } from './border';

const prefix = 'icon-';

export const iconBorder = attributesShorter(
	prefixAttributesCreator({
		obj: border,
		prefix,
	}),
	'iconBorder'
);

export const iconBorderWidth = attributesShorter(
	prefixAttributesCreator({
		obj: borderWidth,
		prefix,
	}),
	'iconBorderWidth'
);

export const iconBorderRadius = attributesShorter(
	prefixAttributesCreator({
		obj: borderRadius,
		prefix,
		diffValAttr: { 'icon-border-radius-unit-general': 'px' },
	}),
	'iconBorderRadius'
);
