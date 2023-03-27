import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';

const prefix = 'bo-'; // border

export const rawBorder = {
	...paletteAttributesCreator({ prefix, palette: 2 }),
	'bo-s': {
		type: 'string',
		default: 'none',
		longLabel: 'border-style',
	},
};

export const rawBorderWidth = prefixAttributesCreator({
	obj: {
		'w.t': {
			type: 'number',
			default: 2,
			longLabel: 'width-top',
		},
		'w.r': {
			type: 'number',
			default: 2,
			longLabel: 'width-right',
		},
		'w.b': {
			type: 'number',
			default: 2,
			longLabel: 'width-bottom',
		},
		'w.l': {
			type: 'number',
			default: 2,
			longLabel: 'width-left',
		},
		'w.sync': {
			type: 'string',
			default: 'all',
			longLabel: 'width-sync',
		},
		'w.u': {
			type: 'string',
			default: 'px',
			longLabel: 'width-unit',
		},
	},
	prefix,
});

export const rawBorderRadius = prefixAttributesCreator({
	obj: {
		'.ra-t.l': {
			type: 'number',
			longLabel: 'radius-top-left',
		},
		'.ra-t.r': {
			type: 'number',
			longLabel: 'radius-top-right',
		},
		'.ra-b.r': {
			type: 'number',
			longLabel: 'radius-bottom-right',
		},
		'.ra-b.l': {
			type: 'number',
			longLabel: 'radius-bottom-left',
		},
		'.ra-sy': {
			type: 'string',
			default: 'all',
			longLabel: 'radius-sync',
		},
		'.ra-u': {
			type: 'string',
			default: 'px',
			longLabel: 'radius-unit',
		},
	},
	prefix,
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
