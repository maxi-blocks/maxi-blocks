export const motion = {
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
	'motion-transition-duration-general': {
		type: 'number',
		default: 0,
	},
	'motion-transition-easing': {
		type: 'number',
		default: 0,
	},
};

export const entrance = {
	'entrance-type': {
		type: 'string',
		default: 'none',
	},
	'entrance-duration': {
		type: 'number',
		default: 1,
	},
	'entrance-delay': {
		type: 'number',
		default: 1,
	},
};

export const parallax = {
	'parallax-status': {
		type: 'boolean',
		default: false,
	},
	'parallax-speed': {
		type: 'number',
		default: 4,
	},
	'parallax-direction': {
		type: 'string',
		default: 'up',
	},
};
