import breakpointAttributesCreator from '../breakpointAttributesCreator';
import hoverAttributesCreator from '../hoverAttributesCreator';

export const rawImageShape = {
	'image-shape-scale': {
		type: 'number',
		default: 100,
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

export const imageShapeHover = hoverAttributesCreator({
	obj: imageShape,
});
