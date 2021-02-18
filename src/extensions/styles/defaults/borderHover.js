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

		value.default = '';

		response[newKey] = value;
	});

	return response;
})();

export const borderWidthHover = (() => {
	const response = {};

	Object.keys(borderWidth).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...borderWidth[key] };

		value.default = '';

		response[newKey] = value;
	});

	return response;
})();

export const borderRadiusHover = (() => {
	let response = {};

	Object.keys(borderRadius).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...borderRadius[key] };

		value.default = '';

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
