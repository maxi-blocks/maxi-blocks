import { border, borderWidth, borderRadius } from './border';

export const borderHover = (() => {
	const response = {
		'border-status-hover': {
			type: 'boolean',
			default: false,
		},
	};

	Object.keys(border).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...border[key] };

		if (key !== 'border-palette-color-status-general' && 'default' in value)
			delete value.default;
		if (key === 'border-palette-color-general') value.default = 6;
		if (key === 'border-style-general') value.default = 'none';

		response[newKey] = value;
	});

	return response;
})();

export const borderWidthHover = (() => {
	const response = {};

	Object.keys(borderWidth).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...borderWidth[key] };

		if ('default' in value) delete value.default;

		response[newKey] = value;
	});

	return response;
})();

export const borderRadiusHover = (() => {
	let response = {};

	Object.keys(borderRadius).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...borderRadius[key] };

		if ('default' in value) delete value.default;

		response[newKey] = value;
	});

	response = {
		...response,
		'border-unit-radius-general-hover': {
			type: 'string',
			default: 'px',
		},
	};

	return response;
})();
