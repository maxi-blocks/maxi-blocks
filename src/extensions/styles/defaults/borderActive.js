import prefixAttributesCreator from '@extensions/styles/prefixAttributesCreator';
import { border, borderWidth, borderRadius } from './border';

const prefix = 'active-';

export const borderActive = prefixAttributesCreator({
	obj: border,
	diffValAttr: { [`${prefix}border-palette-color-general`]: 6 },
	newAttr: {
		'border-status-active': {
			type: 'boolean',
			default: false,
		},
	},
	prefix,
});

export const borderWidthActive = prefixAttributesCreator({
	obj: borderWidth,
	prefix,
});

export const borderRadiusActive = prefixAttributesCreator({
	obj: borderRadius,
	prefix,
});
