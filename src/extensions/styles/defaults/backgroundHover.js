import {
	background,
	backgroundColor,
	backgroundImage,
	backgroundVideo,
	backgroundGradient,
	backgroundSVG,
} from './background';

export const backgroundHover = (() => {
	const response = {
		'background-status-hover': {
			type: 'boolean',
			default: false,
		},
	};

	Object.keys(background).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...background[key] };

		if ('default' in value) delete value.default;

		response[newKey] = value;
	});

	return response;
})();

export const backgroundColorHover = (() => {
	const response = {};

	Object.keys(backgroundColor).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...backgroundColor[key] };

		if ('default' in value) delete value.default;

		response[newKey] = value;
	});

	return response;
})();

export const backgroundImageHover = (() => {
	const response = {};

	Object.keys(backgroundImage).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...backgroundImage[key] };

		if ('default' in value) delete value.default;

		response[newKey] = value;
	});

	return response;
})();

export const backgroundVideoHover = (() => {
	const response = {};

	Object.keys(backgroundVideo).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...backgroundVideo[key] };

		if ('default' in value) delete value.default;

		response[newKey] = value;
	});

	return response;
})();

export const backgroundGradientHover = (() => {
	const response = {};

	Object.keys(backgroundGradient).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...backgroundGradient[key] };

		if ('default' in value) delete value.default;

		response[newKey] = value;
	});

	return response;
})();

export const backgroundSVGHover = (() => {
	const response = {};

	Object.keys(backgroundSVG).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...backgroundSVG[key] };

		if ('default' in value) delete value.default;

		response[newKey] = value;
	});

	return response;
})();
