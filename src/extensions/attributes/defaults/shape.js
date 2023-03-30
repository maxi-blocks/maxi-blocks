import paletteAttributesCreator from '../paletteAttributesCreator';

const shape = {
	...paletteAttributesCreator({
		prefix: 'sf-',
		longPrefix: 'shape-fill-',
		palette: 4,
	}),
	_sw: {
		type: 'number',
		default: 64,
		longLabel: 'shape-width',
	},
	'_sw.u': {
		type: 'string',
		default: 'px',
		longLabel: 'shape-width-unit',
	},
};

export default shape;
