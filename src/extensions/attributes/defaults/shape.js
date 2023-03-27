import paletteAttributesCreator from '../paletteAttributesCreator';

const shape = {
	...paletteAttributesCreator({ prefix: 'sf-', palette: 4 }), // shape-fill-
	sw: {
		type: 'number',
		default: 64,
		longLabel: 'shape-width',
	},
	'sw.u': {
		type: 'string',
		default: 'px',
		longLabel: 'shape-width-unit',
	},
};

export default shape;
