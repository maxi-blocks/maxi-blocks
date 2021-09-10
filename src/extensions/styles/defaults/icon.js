import padding from './padding';

export const icon = {
	'icon-inherit': {
		type: 'boolean',
		default: true,
	},
	'icon-content': {
		type: 'string',
		default: '',
	},
	'icon-position': {
		type: 'string',
		default: 'right',
	},
	'icon-size-general': {
		type: 'number',
		default: 32,
	},
	'icon-size-xxl': {
		type: 'number',
	},
	'icon-size-xl': {
		type: 'number',
	},
	'icon-size-l': {
		type: 'number',
	},
	'icon-size-m': {
		type: 'number',
	},
	'icon-size-s': {
		type: 'number',
	},
	'icon-size-xs': {
		type: 'number',
	},
	'icon-spacing-general': {
		type: 'number',
		default: 5,
	},
	'icon-spacing-xxl': {
		type: 'number',
	},
	'icon-spacing-xl': {
		type: 'number',
	},
	'icon-spacing-l': {
		type: 'number',
	},
	'icon-spacing-m': {
		type: 'number',
	},
	'icon-spacing-s': {
		type: 'number',
	},
	'icon-spacing-xs': {
		type: 'number',
	},
	'icon-stroke-general': {
		type: 'number',
		default: 2,
	},
	'icon-stroke-xxl': {
		type: 'number',
	},
	'icon-stroke-xl': {
		type: 'number',
	},
	'icon-stroke-l': {
		type: 'number',
	},
	'icon-stroke-m': {
		type: 'number',
	},
	'icon-stroke-s': {
		type: 'number',
	},
	'icon-stroke-xs': {
		type: 'number',
	},
	'icon-palette-color-status': {
		type: 'boolean',
		default: true,
	},
	'icon-palette-color': {
		type: 'number',
		default: 1,
	},
	'icon-palette-opacity': {
		type: 'number',
	},
	'icon-color': {
		type: 'string',
	},
};

export const iconPadding = (() => {
	const response = {};

	Object.keys(padding).forEach(key => {
		const newKey = `icon-${key}`;
		const value = { ...padding[key] };

		response[newKey] = value;
	});

	console.log(response);

	return response;
})();

export const iconBackgroundColor = {
	'icon-background-palette-color-status': {
		type: 'boolean',
		default: true,
	},
	'icon-background-palette-color': {
		type: 'number',
		default: 4,
	},
	'icon-background-palette-opacity': {
		type: 'number',
	},
	'icon-background-color': {
		type: 'string',
	},
};

export const iconGradient = {
	'icon-background-gradient': {
		type: 'string',
	},
	'icon-background-gradient-opacity': {
		type: 'number',
		default: 1,
	},
};
