import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';

const prefixTop = 'sdt-';
const longPrefixTop = 'shape-divider-top-';
const prefixBottom = 'sdb-';
const longPrefixBottom = 'shape-divider-bottom-';

const commonShapeDividerBP = {
	_h: {
		type: 'number',
		default: 100,
		longLabel: 'height',
	},
	'_h.u': {
		type: 'string',
		default: 'px',
		longLabel: 'height-unit',
	},
	_o: {
		type: 'number',
		default: 1,
		longLabel: 'opacity',
	},
};

const commonShapeDivider = {
	'.s': {
		type: 'boolean',
		default: false,
		longLabel: 'status',
	},
	_ss: {
		type: 'string',
		longLabel: 'shape-style',
	},
	'_ef.s': {
		type: 'boolean',
		default: false,
		longLabel: 'effects-status',
	},
};

const rawShapeDivider = {
	...prefixAttributesCreator({
		obj: commonShapeDividerBP,
		prefix: prefixTop,
		longPrefix: longPrefixTop,
	}),
	...prefixAttributesCreator({
		obj: commonShapeDividerBP,
		prefix: prefixBottom,
		longPrefix: longPrefixBottom,
	}),
	...paletteAttributesCreator({
		prefix: prefixTop,
		longPrefix: longPrefixTop,
		palette: 5,
	}),
	...paletteAttributesCreator({
		prefix: prefixBottom,
		longPrefix: longPrefixBottom,
		palette: 5,
	}),
};

const shapeDivider = {
	...breakpointAttributesCreator({ obj: rawShapeDivider }),
	...prefixAttributesCreator({
		obj: commonShapeDivider,
		prefix: prefixTop,
		longPrefix: longPrefixTop,
	}),
	...prefixAttributesCreator({
		obj: commonShapeDivider,
		prefix: prefixBottom,
		longPrefix: longPrefixBottom,
	}),
};

export default shapeDivider;
