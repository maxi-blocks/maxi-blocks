import breakpointObjectCreator from '../breakpointObjectCreator';

const rawTransform = {
	'transform-scale-x': {
		type: 'number',
	},
	'transform-scale-y': {
		type: 'number',
	},
	'transform-translate-x-unit': {
		type: 'string',
		default: '%',
	},
	'transform-translate-x': {
		type: 'number',
	},
	'transform-translate-y-unit': {
		type: 'string',
		default: '%',
	},
	'transform-translate-y': {
		type: 'number',
	},
	'transform-rotate-x': {
		type: 'number',
	},
	'transform-rotate-y': {
		type: 'number',
	},
	'transform-rotate-z': {
		type: 'number',
	},
	'transform-origin-x': {
		type: 'string',
	},
	'transform-origin-y': {
		type: 'string',
	},
	'transform-origin-x-unit': {
		type: 'string',
		default: '%',
	},
	'transform-origin-y-unit': {
		type: 'string',
		default: '%',
	},
};

const transform = breakpointObjectCreator({
	obj: rawTransform
});


export default transform;
