import { boxShadow } from './boxShadow';

export const boxShadowHover = (() => {
	const response = {
		'box-shadow-status-hover': {
			type: 'boolean',
			default: false,
		},
	};

	Object.keys(boxShadow).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...boxShadow[key] };

		if (
			key !== 'box-shadow-palette-color-status-general' &&
			'default' in value
		)
			value.default = '';
		if (key === 'box-shadow-palette-color-general') value.default = 6;

		response[newKey] = value;
	});

	return response;
})();

export const buttonBoxShadowHover = (() => {
	const response = {};

	Object.keys(boxShadowHover).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...boxShadowHover[key] };

		if ('default' in value) delete value.default;

		response[newKey] = value;
	});

	return response;
})();
