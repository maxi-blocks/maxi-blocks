import breakpointAttributesCreator from '../breakpointAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';

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

const imageShape = breakpointAttributesCreator({
	obj: rawImageShape,
});

export default attributesShorter(imageShape, 'imageShape');
