import { border, borderWidth, borderRadius } from './border';

export const iconBorderHover = (() => {
	const response = {};

	Object.keys(border).forEach(key => {
		const newKey = `icon-${key}-hover`;
		const value = { ...border[key] };

		response[newKey] = value;
	});

	return response;
})();

export const iconBorderWidthHover = (() => {
	const response = {};

	Object.keys(borderWidth).forEach(key => {
		const newKey = `icon-${key}-hover`;
		const value = { ...borderWidth[key] };

		if ('default' in value) delete value.default;

		response[newKey] = value;
	});

	return response;
})();

export const iconBorderRadiusHover = (() => {
	let response = {};

	Object.keys(borderRadius).forEach(key => {
		const newKey = `icon-${key}-hover`;
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
		'icon-border-unit-radius-general-hover': {
			type: 'string',
			default: 'px',
		},
	};
	return response;
})();
