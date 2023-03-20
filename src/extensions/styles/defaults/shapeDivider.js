import breakpointAttributesCreator from '../breakpointAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';
import paletteAttributesCreator from '../paletteAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';

const prefix = 'shape-divider-';
const prefixTop = `${prefix}top-`;
const prefixBottom = `${prefix}bottom-`;

const commonShapeDividerBP = {
	height: {
		type: 'number',
		default: 100,
	},
	'height-unit': {
		type: 'string',
		default: 'px',
	},
	opacity: {
		type: 'number',
		default: 1,
	},
};

const commonShapeDivider = {
	status: {
		type: 'boolean',
		default: false,
	},
	'shape-style': {
		type: 'string',
	},
	'effects-status': {
		type: 'boolean',
		default: false,
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
	...paletteAttributesCreator({ prefix: 'shape-divider-top-', palette: 5 }),
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

export default attributesShorter(shapeDivider, 'shapeDivider');
