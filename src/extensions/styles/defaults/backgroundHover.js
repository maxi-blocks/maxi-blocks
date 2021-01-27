import {
	background,
	backgroundColor,
	backgroundImage,
	backgroundVideo,
	backgroundGradient,
	backgroundSVG,
} from './background';

export const backgroundHover = (function backgroundHoverGenerator() {
	const response = {
		'background-status-hover': {
			type: 'boolean',
			default: false,
		},
	};

	Object.keys(background).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...background[key] };

		if (value.type === 'string' || value.type === 'number')
			value.default = '';

		response[newKey] = value;
	});

	return response;
})();

export const backgroundColorHover = (function backgroundHoverGenerator() {
	const response = {};

	Object.keys(backgroundColor).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...backgroundColor[key] };

		value.default = '';

		response[newKey] = value;
	});

	return response;
})();

export const backgroundImageHover = (function backgroundHoverGenerator() {
	const response = {};

	Object.keys(backgroundImage).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...backgroundImage[key] };

		value.default = '';

		response[newKey] = value;
	});

	return response;
})();

export const backgroundVideoHover = (function backgroundHoverGenerator() {
	const response = {};

	Object.keys(backgroundVideo).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...backgroundVideo[key] };

		value.default = '';

		response[newKey] = value;
	});

	return response;
})();

export const backgroundGradientHover = (function backgroundHoverGenerator() {
	const response = {};

	Object.keys(backgroundGradient).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...backgroundGradient[key] };

		value.default = '';

		response[newKey] = value;
	});

	return response;
})();

export const backgroundSVGHover = (function backgroundHoverGenerator() {
	const response = {};

	Object.keys(backgroundSVG).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...backgroundSVG[key] };

		value.default = '';

		response[newKey] = value;
	});

	return response;
})();
