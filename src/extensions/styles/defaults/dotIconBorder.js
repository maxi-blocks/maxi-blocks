import prefixAttributesCreator from '../prefixAttributesCreator';
import { border, borderWidth, borderRadius } from './border';

const prefix = 'navigation-dot-icon-';

export const dotIconBorder = prefixAttributesCreator({
	obj: border,
	newAttr: {
		'navigation-dot-icon-status-border': {
			type: 'boolean',
			default: false,
		},
	},
	prefix,
});

export const dotIconBorderWidth = prefixAttributesCreator({
	obj: borderWidth,
	prefix,
});

export const dotIconBorderRadius = prefixAttributesCreator({
	obj: borderRadius,
	prefix,
	diffValAttr: {
		'navigation-dot-icon-border-unit-radius-general': 'px',
	},
});
