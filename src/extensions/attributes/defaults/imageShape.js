import breakpointAttributesCreator from '../breakpointAttributesCreator';

export const rawImageShape = {
	'is-sc': {
		type: 'number',
		default: 100,
		longLabel: 'image-shape-scale',
	},
	'is-rot': {
		type: 'number',
		longLabel: 'image-shape-rotate',
	},
	'is-fx': {
		type: 'boolean',
		longLabel: 'image-shape-flip-x',
	},
	'is-fy': {
		type: 'boolean',
		longLabel: 'image-shape-flip-y',
	},
};

export const imageShape = breakpointAttributesCreator({
	obj: rawImageShape,
});
