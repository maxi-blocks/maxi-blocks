import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';
import paletteAttributesCreator from '@extensions/styles/paletteAttributesCreator';

const rawShapeDivider = {
	'shape-divider-top-height': {
		type: 'number',
		default: 100,
	},
	'shape-divider-top-height-unit': {
		type: 'string',
		default: 'px',
	},
	'shape-divider-bottom-height': {
		type: 'number',
		default: 100,
	},
	'shape-divider-bottom-height-unit': {
		type: 'string',
		default: 'px',
	},
	...paletteAttributesCreator({ prefix: 'shape-divider-top-', palette: 5 }),
	...paletteAttributesCreator({
		prefix: 'shape-divider-bottom-',
		palette: 5,
	}),
	'shape-divider-top-opacity': {
		type: 'number',
		default: 1,
	},
	'shape-divider-bottom-opacity': {
		type: 'number',
		default: 1,
	},
};

const shapeDivider = {
	...breakpointAttributesCreator({ obj: rawShapeDivider }),
	'shape-divider-top-status': {
		type: 'boolean',
		default: false,
	},
	'shape-divider-top-shape-style': {
		type: 'string',
	},
	'shape-divider-top-effects-status': {
		type: 'boolean',
		default: false,
	},
	'shape-divider-bottom-status': {
		type: 'boolean',
		default: false,
	},
	'shape-divider-bottom-shape-style': {
		type: 'string',
	},
	'shape-divider-bottom-effects-status': {
		type: 'boolean',
		default: false,
	},
};

export default shapeDivider;
