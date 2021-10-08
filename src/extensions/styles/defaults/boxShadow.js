export const boxShadow = {
	'box-shadow-palette-color-status-general': {
		type: 'boolean',
		default: true,
	},
	'box-shadow-palette-color-general': {
		type: 'number',
		default: 8,
	},
	'box-shadow-palette-opacity-general': {
		type: 'number',
	},
	'box-shadow-color-general': {
		type: 'string',
	},
	'box-shadow-horizontal-general': {
		type: 'number',
	},
	'box-shadow-vertical-general': {
		type: 'number',
	},
	'box-shadow-blur-general': {
		type: 'number',
	},
	'box-shadow-spread-general': {
		type: 'number',
	},
	'box-shadow-palette-color-status-xxl': {
		type: 'boolean',
	},
	'box-shadow-palette-color-xxl': {
		type: 'number',
	},
	'box-shadow-palette-opacity-xxl': {
		type: 'number',
	},
	'box-shadow-color-xxl': {
		type: 'string',
	},
	'box-shadow-horizontal-xxl': {
		type: 'number',
	},
	'box-shadow-vertical-xxl': {
		type: 'number',
	},
	'box-shadow-blur-xxl': {
		type: 'number',
	},
	'box-shadow-spread-xxl': {
		type: 'number',
	},
	'box-shadow-palette-color-status-xl': {
		type: 'boolean',
	},
	'box-shadow-palette-color-xl': {
		type: 'number',
	},
	'box-shadow-palette-opacity-xl': {
		type: 'number',
	},
	'box-shadow-color-xl': {
		type: 'string',
	},
	'box-shadow-horizontal-xl': {
		type: 'number',
	},
	'box-shadow-vertical-xl': {
		type: 'number',
	},
	'box-shadow-blur-xl': {
		type: 'number',
	},
	'box-shadow-spread-xl': {
		type: 'number',
	},
	'box-shadow-palette-color-status-l': {
		type: 'boolean',
	},
	'box-shadow-palette-color-l': {
		type: 'number',
	},
	'box-shadow-palette-opacity-l': {
		type: 'number',
	},
	'box-shadow-color-l': {
		type: 'string',
	},
	'box-shadow-horizontal-l': {
		type: 'number',
	},
	'box-shadow-vertical-l': {
		type: 'number',
	},
	'box-shadow-blur-l': {
		type: 'number',
	},
	'box-shadow-spread-l': {
		type: 'number',
	},
	'box-shadow-palette-color-status-m': {
		type: 'boolean',
	},
	'box-shadow-palette-color-m': {
		type: 'number',
	},
	'box-shadow-palette-opacity-m': {
		type: 'number',
	},
	'box-shadow-color-m': {
		type: 'string',
	},
	'box-shadow-horizontal-m': {
		type: 'number',
	},
	'box-shadow-vertical-m': {
		type: 'number',
	},
	'box-shadow-blur-m': {
		type: 'number',
	},
	'box-shadow-spread-m': {
		type: 'number',
	},
	'box-shadow-palette-color-status-s': {
		type: 'boolean',
	},
	'box-shadow-palette-color-s': {
		type: 'number',
	},
	'box-shadow-palette-opacity-s': {
		type: 'number',
	},
	'box-shadow-color-s': {
		type: 'string',
	},
	'box-shadow-horizontal-s': {
		type: 'number',
	},
	'box-shadow-vertical-s': {
		type: 'number',
	},
	'box-shadow-blur-s': {
		type: 'number',
	},
	'box-shadow-spread-s': {
		type: 'number',
	},
	'box-shadow-palette-color-status-xs': {
		type: 'boolean',
	},
	'box-shadow-palette-color-xs': {
		type: 'number',
	},
	'box-shadow-palette-opacity-xs': {
		type: 'number',
	},
	'box-shadow-color-xs': {
		type: 'string',
	},
	'box-shadow-horizontal-xs': {
		type: 'number',
	},
	'box-shadow-vertical-xs': {
		type: 'number',
	},
	'box-shadow-blur-xs': {
		type: 'number',
	},
	'box-shadow-spread-xs': {
		type: 'number',
	},
};

export const buttonBoxShadow = (() => {
	const response = {};

	Object.keys(boxShadow).forEach(key => {
		const newKey = `button-${key}`;
		const value = { ...boxShadow[key] };

		response[newKey] = value;
	});

	return response;
})();
