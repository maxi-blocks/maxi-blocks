import { icon } from './icon';

export const iconHover = (() => {
	const response = {
		'icon-status-hover': {
			type: 'boolean',
			default: false,
		},
	};

	Object.keys(icon).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...icon[key] };

		response[newKey] = value;
	});

	response['icon-palette-color-hover'].default = 6;

	return response;
})();

export const iconBackgroundColorHover = {
	'icon-background-palette-color-status-hover': {
		type: 'boolean',
		default: true,
	},
	'icon-background-palette-color-hover': {
		type: 'number',
		default: 4,
	},
	'icon-background-palette-opacity-hover': {
		type: 'number',
	},
	'icon-background-color-hover': {
		type: 'string',
	},
};

export const iconGradientHover = {
	'icon-background-gradient-hover': {
		type: 'string',
	},
	'icon-background-gradient-opacity-hover': {
		type: 'number',
		default: 1,
	},
};
