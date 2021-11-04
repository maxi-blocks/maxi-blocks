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

		if (key === 'icon-palette-color-hover') value.default = 6;
		if (key === 'icon-width-general') value.default = '';
		if (key === 'icon-stroke-general') value.default = '';

		response[newKey] = value;
	});

	return response;
})();

export const iconBackgroundColorHover = {
	'icon-background-palette-color-status-general-hover': {
		type: 'boolean',
		default: true,
	},
	'icon-background-palette-color-general-hover': {
		type: 'number',
		default: 6,
	},
	'icon-background-palette-opacity-general-hover': {
		type: 'number',
	},
	'icon-background-color-general-hover': {
		type: 'string',
	},
};

export const iconBackgroundGradientHover = {
	'icon-background-gradient-general-hover': {
		type: 'string',
	},
	'icon-background-gradient-opacity-general-hover': {
		type: 'number',
		default: 1,
	},
};
