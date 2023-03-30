import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';

const prefix = 'bo-';
const longPrefix = 'border-';

export const rawBorder = {
	...paletteAttributesCreator({ prefix, longPrefix, palette: 2 }),
	bo_s: {
		type: 'string',
		default: 'none',
		longLabel: 'border-style',
	},
};

export const rawBorderWidth = prefixAttributesCreator({
	obj: {
		'_w.t': {
			type: 'number',
			default: 2,
			longLabel: 'width-top',
		},
		'_w.r': {
			type: 'number',
			default: 2,
			longLabel: 'width-right',
		},
		'_w.b': {
			type: 'number',
			default: 2,
			longLabel: 'width-bottom',
		},
		'_w.l': {
			type: 'number',
			default: 2,
			longLabel: 'width-left',
		},
		'_w.sy': {
			type: 'string',
			default: 'all',
			longLabel: 'width-sync',
		},
		'_w.u': {
			type: 'string',
			default: 'px',
			longLabel: 'width-unit',
		},
	},
	prefix,
	longPrefix,
});

export const rawBorderRadius = prefixAttributesCreator({
	obj: {
		'.ra.tl': {
			type: 'number',
			longLabel: 'radius-top-left',
		},
		'.ra.tr': {
			type: 'number',
			longLabel: 'radius-top-right',
		},
		'.ra.br': {
			type: 'number',
			longLabel: 'radius-bottom-right',
		},
		'.ra.bl': {
			type: 'number',
			longLabel: 'radius-bottom-left',
		},
		'.ra.sy': {
			type: 'string',
			default: 'all',
			longLabel: 'radius-sync',
		},
		'.ra.u': {
			type: 'string',
			default: 'px',
			longLabel: 'radius-unit',
		},
	},
	prefix: 'bo-',
	longPrefix: 'border-',
});

export const border = breakpointAttributesCreator({
	obj: rawBorder,
});
export const borderWidth = breakpointAttributesCreator({
	obj: rawBorderWidth,
});
export const borderRadius = breakpointAttributesCreator({
	obj: rawBorderRadius,
});
