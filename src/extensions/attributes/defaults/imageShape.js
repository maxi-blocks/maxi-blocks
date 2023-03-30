import breakpointAttributesCreator from '../breakpointAttributesCreator';

export const rawImageShape = {
	is_sc: {
		type: 'number',
		default: 100,
		longLabel: 'image-shape-scale',
	},
	is_rot: {
		type: 'number',
		longLabel: 'image-shape-rotate',
	},
	is_fx: {
		type: 'boolean',
		longLabel: 'image-shape-flip-x',
	},
	is_fy: {
		type: 'boolean',
		longLabel: 'image-shape-flip-y',
	},
};

export const imageShape = breakpointAttributesCreator({
	obj: rawImageShape,
});
