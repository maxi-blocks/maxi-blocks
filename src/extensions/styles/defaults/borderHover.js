import {
	border,
	borderWidth,
	borderRadius,
	buttonBorder,
	buttonBorderWidth,
	buttonBorderRadius,
} from './border';

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

export const buttonBorderHover = (() => {
	const response = {
		'button-border-status-hover': {
			type: 'boolean',
			default: false,
		},
	};

	Object.keys(border).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...border[key] };

		if (
			key !== 'button-border-palette-color-status-general' &&
			'default' in value
		)
			delete value.default;
		if (key === 'button-border-palette-color-general') value.default = 6;

		response[newKey] = value;
	});

	return response;
})();

export const buttonBorderWidthHover = (() => {
	const response = {};

	Object.keys(buttonBorderWidth).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...buttonBorderWidth[key] };

		if ('default' in value) delete value.default;

		response[newKey] = value;
	});

	return response;
})();

export const buttonBorderRadiusHover = (() => {
	let response = {};

	Object.keys(buttonBorderRadius).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...buttonBorderRadius[key] };

		if ('default' in value) delete value.default;

		response[newKey] = value;
	});

	response = {
		...response,
		'button-border-unit-radius-general-hover': {
			type: 'string',
			default: 'px',
		},
	};

	return response;
})();
