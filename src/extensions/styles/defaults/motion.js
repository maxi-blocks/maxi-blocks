import breakpointAttributesCreator from '../breakpointAttributesCreator';

const rawMotion = {
	'motion-status': {
		type: 'boolean',
		default: false,
	},
	'motion-time-line': {
		type: 'object',
	},
	'motion-active-time-line-time': {
		type: 'number',
		default: 0,
	},
	'motion-active-time-line-index': {
		type: 'number',
		default: 0,
	},
	'motion-transform-origin-x': {
		type: 'string',
		default: 'center',
	},
	'motion-transform-origin-y': {
		type: 'string',
		default: 'center',
	},
	'motion-preset-status': {
		type: 'boolean',
		default: false,
	},
	'motion-preview-status': {
		type: 'boolean',
		default: false,
	},
	'motion-tablet-status': {
		type: 'boolean',
		default: true,
	},
	'motion-mobile-status': {
		type: 'boolean',
		default: true,
	},
};

const motion = breakpointAttributesCreator({
	obj: rawMotion,
});

export default motion;
