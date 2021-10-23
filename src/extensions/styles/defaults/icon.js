import { backgroundColor, backgroundGradient } from './background';
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
	'icon-only': {
		type: 'boolean',
		default: false,
	},
	'icon-position': {
		type: 'string',
		default: 'right',
	},
	'icon-width-general': {
		type: 'number',
		default: 32,
	},
	'icon-width-xxl': {
		type: 'number',
	},
	'icon-width-xl': {
		type: 'number',
	},
	'icon-width-l': {
		type: 'number',
	},
	'icon-width-m': {
		type: 'number',
	},
	'icon-width-s': {
		type: 'number',
	},
	'icon-width-xs': {
		type: 'number',
	},
	'icon-width-unit-general': {
		type: 'string',
		default: 'px',
	},
	'icon-width-unit-xxl': {
		type: 'string',
	},
	'icon-width-unit-xl': {
		type: 'string',
	},
	'icon-width-unit-l': {
		type: 'string',
	},
	'icon-width-unit-m': {
		type: 'string',
	},
	'icon-width-unit-s': {
		type: 'string',
	},
	'icon-width-unit-xs': {
		type: 'string',
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

	return response;
})();

export const iconBackgroundColor = (() => {
	const response = {};

	Object.keys(backgroundColor).forEach(key => {
		if (key === 'background-color-clip-path-general') return;

		const newKey = `icon-${key}`;
		const value = { ...padding[key] };

		response[newKey] = value;
	});

	return response;
})();

export const iconBackgroundGradient = (() => {
	const response = {};

	Object.keys(backgroundGradient).forEach(key => {
		if (key === 'background-gradient-clip-path-general') return;

		const newKey = `icon-${key}`;
		const value = { ...padding[key] };

		response[newKey] = value;
	});

	return response;
})();
