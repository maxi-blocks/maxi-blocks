import breakpointAttributesCreator from '../breakpointAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';

const rawTransform = {
	'transform-scale': {
		type: 'object',
	},
	'transform-translate': {
		type: 'object',
	},
	'transform-rotate': {
		type: 'object',
	},
	'transform-origin': {
		type: 'object',
	},
};

const transform = {
	'transform-target': {
		type: 'string',
	},
	...breakpointAttributesCreator({
		obj: rawTransform,
	}),
};

export default attributesShorter(transform, 'transform');
