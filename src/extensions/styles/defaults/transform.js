import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

const rawTransform = {
	'transform-scale': {
		type: 'object',
	},
	'transform-translate': {
		type: 'object',
	},
	'transform-skew': {
		type: 'object',
	},
	'transform-perspective': {
		type: 'object',
	},
	'transform-translate3d': {
		type: 'object',
	},
	'transform-scale3d': {
		type: 'object',
	},
	'transform-rotate': {
		type: 'object',
	},
	'transform-rotate3d': {
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

export default transform;
