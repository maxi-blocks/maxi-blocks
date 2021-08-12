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
	'icon-size': {
		type: 'number',
		default: 32,
	},
	'icon-spacing': {
		type: 'number',
		default: 5,
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
