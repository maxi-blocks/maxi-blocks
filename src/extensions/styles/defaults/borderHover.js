import { border, borderWidth, borderRadius } from './border';

export const borderHover = (function backgroundHoverGenerator() {
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

export const borderWidthHover = (function backgroundHoverGenerator() {
	const response = {};

	Object.keys(borderWidth).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...borderWidth[key] };

		value.default = '';

		response[newKey] = value;
	});

	return response;
})();

export const borderRadiusHover = (function backgroundHoverGenerator() {
	const response = {};

	Object.keys(borderRadius).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...borderRadius[key] };

		value.default = '';

		response[newKey] = value;
	});

	return response;
})();
