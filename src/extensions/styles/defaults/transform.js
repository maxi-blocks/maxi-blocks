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
	'transform-target': {
		type: 'string',
	},
	'transform-hover-status': {
		type: 'boolean',
		default: false,
	},
	...breakpointAttributesCreator({
		obj: rawTransform,
	}),
};

export default transform;
