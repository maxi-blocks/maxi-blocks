import boxShadow from '../../extensions/styles/defaults/boxShadow';

export const boxShadowNone = prefix => {
	let response = {};

	response = {
		[`${[prefix]}box-shadow-palette-opacity`]:
			boxShadow[`${[prefix]}box-shadow-palette-opacity-general`].default,
		[`${[prefix]}box-shadow-horizontal`]:
			boxShadow[`${[prefix]}box-shadow-horizontal-general`].default,
		[`${[prefix]}box-shadow-horizontal-unit`]:
			boxShadow[`${[prefix]}box-shadow-horizontal-unit-general`].default,
		[`${[prefix]}box-shadow-vertical`]:
			boxShadow[`${[prefix]}box-shadow-vertical-general`].default,
		[`${[prefix]}box-shadow-vertical-unit`]:
			boxShadow[`${[prefix]}box-shadow-vertical-unit-general`].default,
		[`${[prefix]}box-shadow-blur`]:
			boxShadow[`${[prefix]}box-shadow-blur-general`].default,
		[`${[prefix]}box-shadow-blur-unit`]:
			boxShadow[`${[prefix]}box-shadow-blur-unit-general`].default,
		[`${[prefix]}box-shadow-spread`]:
			boxShadow[`${[prefix]}box-shadow-spread-general`].default,
		[`${[prefix]}box-shadow-spread-unit`]:
			boxShadow[`${[prefix]}box-shadow-spread-unit-general`].default,
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
		...boxShadowUnits(prefix),
	};

	return response;
};
