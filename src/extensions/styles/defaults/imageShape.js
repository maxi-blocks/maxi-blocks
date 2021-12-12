import breakpointAttributesCreator from '../breakpointAttributesCreator';

export const rawImageShape = {
	'image-shape-scale': {
		type: 'number',
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
