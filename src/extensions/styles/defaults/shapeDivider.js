import paletteAttributesCreator from '../paletteAttributesCreator';

const shapeDivider = {
	'shape-divider-top-status': {
		type: 'boolean',
		default: false,
	},
	'shape-divider-top-height': {
		type: 'number',
		default: 100,
	},
	'shape-divider-top-height-unit': {
		type: 'string',
		default: 'px',
	},
	'shape-divider-top-opacity': {
		type: 'number',
		default: 1,
	},
	'shape-divider-top-shape-style': {
		type: 'string',
	},
	...paletteAttributesCreator({ prefix: 'shape-divider-top-', palette: 5 }),
	'shape-divider-top-effects-status': {
		type: 'boolean',
		default: false,
	},
	'shape-divider-bottom-status': {
		type: 'boolean',
		default: false,
	},
	'shape-divider-bottom-height': {
		type: 'number',
		default: 100,
	},
	'shape-divider-bottom-height-unit': {
		type: 'string',
		default: 'px',
	},
	'shape-divider-bottom-opacity': {
		type: 'number',
		default: 1,
	},
	'shape-divider-bottom-shape-style': {
		type: 'string',
	},
	...paletteAttributesCreator({
		prefix: 'shape-divider-bottom-',
		palette: 5,
	}),
	'shape-divider-bottom-effects-status': {
		type: 'boolean',
		default: false,
	},
};

export default shapeDivider;
