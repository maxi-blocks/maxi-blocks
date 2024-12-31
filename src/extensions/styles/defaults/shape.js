import paletteAttributesCreator from '@extensions/styles/paletteAttributesCreator';

const shape = {
	...paletteAttributesCreator({ prefix: 'shape-fill-', palette: 4 }),
	'shape-width': {
		type: 'number',
		default: 64,
	},
	'shape-width-unit': {
		type: 'string',
		default: 'px',
	},
};

export default shape;
