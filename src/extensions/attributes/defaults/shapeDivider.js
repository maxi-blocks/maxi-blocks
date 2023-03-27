import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';

const prefixTop = 'sdt-'; // shape-divider-top-
const prefixBottom = 'sdb-'; // shape-divider-bottom-

const commonShapeDividerBP = {
	h: {
		type: 'number',
		default: 100,
		longLabel: 'height',
	},
	'h.u': {
		type: 'string',
		default: 'px',
		longLabel: 'height-unit',
	},
	o: {
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
	ss: {
		type: 'string',
		longLabel: 'shape-style',
	},
	'ef.s': {
		type: 'boolean',
		default: false,
		longLabel: 'effects-status',
	},
};

const rawShapeDivider = {
	...prefixAttributesCreator({
		obj: commonShapeDividerBP,
		prefix: prefixTop,
	}),
	...prefixAttributesCreator({
		obj: commonShapeDividerBP,
		prefix: prefixBottom,
	}),
	...paletteAttributesCreator({ prefix: 'sdt-', palette: 5 }), // shape-divider-top-
	...paletteAttributesCreator({
		prefix: 'shape-divider-bottom-',
		palette: 5,
	}),
};

const shapeDivider = {
	...breakpointAttributesCreator({ obj: rawShapeDivider }),
	...prefixAttributesCreator({
		obj: commonShapeDivider,
		prefix: prefixTop,
	}),
	...prefixAttributesCreator({
		obj: commonShapeDivider,
		prefix: prefixBottom,
	}),
};

export default shapeDivider;
