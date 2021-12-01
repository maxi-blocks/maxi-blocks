import breakpointObjectCreator from '../breakpointObjectCreator';

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

export const imageShape = breakpointObjectCreator({
	obj: rawImageShape,
});
