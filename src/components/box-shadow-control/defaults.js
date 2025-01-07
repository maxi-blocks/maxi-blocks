import boxShadow from '@extensions/styles/defaults/boxShadow';

export const boxShadowNone = prefix => {
	let response = {};

	response = {
		[`${[prefix]}box-shadow-palette-opacity`]:
			boxShadow['box-shadow-palette-opacity-general'].default,
		[`${[prefix]}box-shadow-horizontal`]:
			boxShadow['box-shadow-horizontal-general'].default,
		[`${[prefix]}box-shadow-horizontal-unit`]:
			boxShadow['box-shadow-horizontal-unit-general'].default,
		[`${[prefix]}box-shadow-vertical`]:
			boxShadow['box-shadow-vertical-general'].default,
		[`${[prefix]}box-shadow-vertical-unit`]:
			boxShadow['box-shadow-vertical-unit-general'].default,
		[`${[prefix]}box-shadow-blur`]:
			boxShadow['box-shadow-blur-general'].default,
		[`${[prefix]}box-shadow-blur-unit`]:
			boxShadow['box-shadow-blur-unit-general'].default,
		[`${[prefix]}box-shadow-spread`]:
			boxShadow['box-shadow-spread-general'].default,
		[`${[prefix]}box-shadow-spread-unit`]:
			boxShadow['box-shadow-spread-unit-general'].default,
		[`${[prefix]}box-shadow-inset`]:
			boxShadow['box-shadow-inset-general'].default,
	};

	return response;
};

const boxShadowUnits = prefix => {
	let response = {};

	response = {
		[`${[prefix]}box-shadow-horizontal-unit`]: 'px',
		[`${[prefix]}box-shadow-vertical-unit`]: 'px',
		[`${[prefix]}box-shadow-blur-unit`]: 'px',
		[`${[prefix]}box-shadow-spread-unit`]: 'px',
	};

	return response;
};

export const boxShadowTotal = prefix => {
	let response = {};

	response = {
		[`${prefix}box-shadow-palette-opacity`]: 0.23,
		[`${prefix}box-shadow-horizontal`]: 0,
		[`${prefix}box-shadow-vertical`]: 30,
		[`${prefix}box-shadow-blur`]: 50,
		[`${prefix}box-shadow-spread`]: 0,
		[`${prefix}box-shadow-inset`]: false,
		...boxShadowUnits(prefix),
	};

	return response;
};

export const boxShadowBottom = prefix => {
	let response = {};

	response = {
		[`${prefix}box-shadow-palette-opacity`]: 0.5,
		[`${prefix}box-shadow-horizontal`]: 0,
		[`${prefix}box-shadow-vertical`]: 30,
		[`${prefix}box-shadow-blur`]: 50,
		[`${prefix}box-shadow-spread`]: 0,
		[`${prefix}box-shadow-inset`]: false,
		...boxShadowUnits(prefix),
	};

	return response;
};

export const boxShadowSolid = prefix => {
	let response = {};

	response = {
		[`${prefix}box-shadow-palette-opacity`]: 0.5,
		[`${prefix}box-shadow-horizontal`]: 5,
		[`${prefix}box-shadow-vertical`]: 6,
		[`${prefix}box-shadow-blur`]: 0,
		[`${prefix}box-shadow-spread`]: 0,
		[`${prefix}box-shadow-inset`]: false,
		...boxShadowUnits(prefix),
	};

	return response;
};
