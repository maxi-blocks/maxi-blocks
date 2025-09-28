import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

export const rawImageShape = {
	'image-shape-scale': {
		type: 'number',
		default: 100,
		min: 0,
	},
	'image-shape-rotate': {
		type: 'number',
	},
	'image-shape-flip-x': {
		type: 'boolean',
	},
	'image-shape-flip-y': {
		type: 'boolean',
	},
};

export const imageShape = breakpointAttributesCreator({
	obj: rawImageShape,
});
