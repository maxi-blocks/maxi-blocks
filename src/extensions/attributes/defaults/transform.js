import breakpointAttributesCreator from '../breakpointAttributesCreator';

const rawTransform = {
	'tr-sc': {
		type: 'object',
		longLabel: 'transform-scale',
	},
	'tr-tr': {
		type: 'object',
		longLabel: 'transform-translate',
	},
	'tr-rot': {
		type: 'object',
		longLabel: 'transform-rotate',
	},
	'tr-ori': {
		type: 'object',
		longLabel: 'transform-origin',
	},
};

const transform = {
	'tr-tar': {
		type: 'string',
		longLabel: 'transform-target',
	},
	...breakpointAttributesCreator({
		obj: rawTransform,
	}),
};

export default transform;
