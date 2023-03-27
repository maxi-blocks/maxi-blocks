import prefixAttributesCreator from '../prefixAttributesCreator';
import { border, borderWidth, borderRadius } from './border';

const prefix = 'a-'; // active-

export const borderActive = prefixAttributesCreator({
	obj: border,
	diffValAttr: { [`${prefix}bo-pc-general`]: 6 }, // border-palette-color-general
	newAttr: {
		'bo.sa': {
			type: 'boolean',
			default: false,
			longLabel: 'border-status-active',
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
