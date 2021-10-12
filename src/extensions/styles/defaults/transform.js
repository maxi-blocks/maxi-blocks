const transform = {
	'transform-scale-x-general': {
		type: 'number',
	},
	'transform-scale-y-general': {
		type: 'number',
	},
	'transform-translate-x-unit-general': {
		type: 'string',
		default: '%',
	},
	'transform-translate-x-general': {
		type: 'number',
	},
	'transform-translate-y-unit-general': {
		type: 'string',
		default: '%',
	},
	'transform-translate-y-general': {
		type: 'number',
	},
	'transform-rotate-x-general': {
		type: 'number',
	},
	'transform-rotate-y-general': {
		type: 'number',
	},
	'transform-rotate-z-general': {
		type: 'number',
	},
	'transform-origin-x-general': {
		type: 'string',
	},
	'transform-origin-y-general': {
		type: 'string',
	},
	'transform-origin-x-unit-general': {
		type: 'string',
		default: '%',
	},
	'transform-origin-x-unit-xxl': {
		type: 'string',
	},
	'transform-origin-x-unit-xl': {
		type: 'string',
	},
	'transform-origin-x-unit-l': {
		type: 'string',
	},
	'transform-origin-x-unit-m': {
		type: 'string',
	},
	'transform-origin-x-unit-s': {
		type: 'string',
	},
	'transform-origin-x-unit-xs': {
		type: 'string',
	},
	'transform-origin-y-unit-general': {
		type: 'string',
		default: '%',
	},
	'transform-origin-y-unit-xxl': {
		type: 'string',
	},
	'transform-origin-y-unit-xl': {
		type: 'string',
	},
	'transform-origin-y-unit-l': {
		type: 'string',
	},
	'transform-origin-y-unit-m': {
		type: 'string',
	},
	'transform-origin-y-unit-s': {
		type: 'string',
	},
	'transform-origin-y-unit-xs': {
		type: 'string',
	},
	'transform-scale-x-xxl': {
		type: 'number',
	},
	'transform-scale-y-xxl': {
		type: 'number',
	},
	'transform-translate-x-unit-xxl': {
		type: 'string',
	},
	'transform-translate-x-xxl': {
		type: 'number',
	},
	'transform-translate-y-unit-xxl': {
		type: 'string',
	},
	'transform-translate-y-xxl': {
		type: 'number',
	},
	'transform-rotate-x-xxl': {
		type: 'number',
	},
	'transform-rotate-y-xxl': {
		type: 'number',
	},
	'transform-rotate-z-xxl': {
		type: 'number',
	},
	'transform-origin-x-xxl': {
		type: 'string',
	},
	'transform-origin-y-xxl': {
		type: 'string',
	},
	'transform-scale-x-xl': {
		type: 'number',
	},
	'transform-scale-y-xl': {
		type: 'number',
	},
	'transform-translate-x-unit-xl': {
		type: 'string',
	},
	'transform-translate-x-xl': {
		type: 'number',
	},
	'transform-translate-y-unit-xl': {
		type: 'string',
	},
	'transform-translate-y-xl': {
		type: 'number',
	},
	'transform-rotate-x-xl': {
		type: 'number',
	},
	'transform-rotate-y-xl': {
		type: 'number',
	},
	'transform-rotate-z-xl': {
		type: 'number',
	},
	'transform-origin-x-xl': {
		type: 'string',
	},
	'transform-origin-y-xl': {
		type: 'string',
	},
	'transform-scale-x-l': {
		type: 'number',
	},
	'transform-scale-y-l': {
		type: 'number',
	},
	'transform-translate-x-unit-l': {
		type: 'string',
	},
	'transform-translate-x-l': {
		type: 'number',
	},
	'transform-translate-y-unit-l': {
		type: 'string',
	},
	'transform-translate-y-l': {
		type: 'number',
	},
	'transform-rotate-x-l': {
		type: 'number',
	},
	'transform-rotate-y-l': {
		type: 'number',
	},
	'transform-rotate-z-l': {
		type: 'number',
	},
	'transform-origin-x-l': {
		type: 'string',
	},
	'transform-origin-y-l': {
		type: 'string',
	},
	'transform-scale-x-m': {
		type: 'number',
	},
	'transform-scale-y-m': {
		type: 'number',
	},
	'transform-translate-x-unit-m': {
		type: 'string',
	},
	'transform-translate-x-m': {
		type: 'number',
	},
	'transform-translate-y-unit-m': {
		type: 'string',
	},
	'transform-translate-y-m': {
		type: 'number',
	},
	'transform-rotate-x-m': {
		type: 'number',
	},
	'transform-rotate-y-m': {
		type: 'number',
	},
	'transform-rotate-z-m': {
		type: 'number',
	},
	'transform-origin-x-m': {
		type: 'string',
	},
	'transform-origin-y-m': {
		type: 'string',
	},
	'transform-scale-x-s': {
		type: 'number',
	},
	'transform-scale-y-s': {
		type: 'number',
	},
	'transform-translate-x-unit-s': {
		type: 'string',
	},
	'transform-translate-x-s': {
		type: 'number',
	},
	'transform-translate-y-unit-s': {
		type: 'string',
	},
	'transform-translate-y-s': {
		type: 'number',
	},
	'transform-rotate-x-s': {
		type: 'number',
	},
	'transform-rotate-y-s': {
		type: 'number',
	},
	'transform-rotate-z-s': {
		type: 'number',
	},
	'transform-origin-x-s': {
		type: 'string',
	},
	'transform-origin-y-s': {
		type: 'string',
	},
	'transform-scale-x-xs': {
		type: 'number',
	},
	'transform-scale-y-xs': {
		type: 'number',
	},
	'transform-translate-x-unit-xs': {
		type: 'string',
	},
	'transform-translate-x-xs': {
		type: 'number',
	},
	'transform-translate-y-unit-xs': {
		type: 'string',
	},
	'transform-translate-y-xs': {
		type: 'number',
	},
	'transform-rotate-x-xs': {
		type: 'number',
	},
	'transform-rotate-y-xs': {
		type: 'number',
	},
	'transform-rotate-z-xs': {
		type: 'number',
	},
	'transform-origin-x-xs': {
		type: 'string',
	},
	'transform-origin-y-xs': {
		type: 'string',
	},
};

export default transform;
