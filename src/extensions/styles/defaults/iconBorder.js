import { border, borderWidth, borderRadius } from './border';

export const iconBorder = (() => {
	const response = {};

	Object.keys(border).forEach(key => {
		const newKey = `icon-${key}`;
		const value = { ...border[key] };

		response[newKey] = value;
	});

	return response;
})();

export const iconBorderWidth = (() => {
	const response = {};

	Object.keys(borderWidth).forEach(key => {
		const newKey = `icon-${key}`;
		const value = { ...borderWidth[key] };

		if ('default' in value) delete value.default;

		response[newKey] = value;
	});

	return response;
})();

export const iconBorderRadius = (() => {
	let response = {};

	Object.keys(borderRadius).forEach(key => {
		const newKey = `icon-${key}`;
		const value = { ...borderRadius[key] };

		if ('default' in value) delete value.default;

		response[newKey] = value;
	});

	response = {
		...response,
		'icon-border-unit-radius-general': {
			type: 'string',
			default: 'px',
		},
	};

	return response;
})();
