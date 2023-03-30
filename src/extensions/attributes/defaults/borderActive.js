import prefixAttributesCreator from '../prefixAttributesCreator';
import { border, borderWidth, borderRadius } from './border';

const prefix = 'a-';
const longPrefix = 'active-';

export const borderActive = prefixAttributesCreator({
	obj: border,
	diffValAttr: { [`${prefix}bo_pc-general`]: 6 }, // border-palette-color-general
	newAttr: {
		'bo.sa': {
			type: 'boolean',
			default: false,
			longLabel: 'border-status-active',
		},
	},
	prefix,
	longPrefix,
});

export const borderWidthActive = prefixAttributesCreator({
	obj: borderWidth,
	prefix,
	longPrefix,
});

export const borderRadiusActive = prefixAttributesCreator({
	obj: borderRadius,
	prefix,
	longPrefix,
});
