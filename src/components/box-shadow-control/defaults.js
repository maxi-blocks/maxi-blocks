import { boxShadow } from '../../extensions/styles/defaults/boxShadow';

export const boxShadowNone = prefix => {
	let response = {};

	response = {
		[`${[prefix]}box-shadow-horizontal`]:
			boxShadow['box-shadow-horizontal-general']?.default,
		[`${[prefix]}box-shadow-vertical`]:
			boxShadow['box-shadow-vertical-general']?.default,
		[`${[prefix]}box-shadow-blur`]:
			boxShadow['box-shadow-blur-general']?.default,
		[`${[prefix]}box-shadow-spread`]:
			boxShadow['box-shadow-spread-general']?.default,
	};

	return response;
};

export const boxShadowTotal = prefix => {
	let response = {};

	response = {
		[`${prefix}box-shadow-palette-opacity`]: 23,
		[`${prefix}box-shadow-horizontal`]: 0,
		[`${prefix}box-shadow-vertical`]: 30,
		[`${prefix}box-shadow-blur`]: 50,
		[`${prefix}box-shadow-spread`]: 0,
	};

	return response;
};

export const boxShadowBottom = prefix => {
	let response = {};

	response = {
		[`${prefix}box-shadow-palette-opacity`]: 50,
		[`${prefix}box-shadow-horizontal`]: 0,
		[`${prefix}box-shadow-vertical`]: 30,
		[`${prefix}box-shadow-blur`]: 50,
		[`${prefix}box-shadow-spread`]: 0,
	};

	return response;
};

export const boxShadowSolid = prefix => {
	let response = {};

	response = {
		[`${prefix}box-shadow-palette-opacity`]: 50,
		[`${prefix}box-shadow-horizontal`]: 5,
		[`${prefix}box-shadow-vertical`]: 6,
		[`${prefix}box-shadow-blur`]: 0,
		[`${prefix}box-shadow-spread`]: 0,
	};

	return response;
};
