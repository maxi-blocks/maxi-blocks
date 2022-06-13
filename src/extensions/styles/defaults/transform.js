import breakpointAttributesCreator from '../breakpointAttributesCreator';

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
	...breakpointAttributesCreator({
		obj: rawTransform,
	}),
};

export default transform;
