export const borderNone = prefix => {
	let response = {};

	response = {
		[`${prefix}border-color`]: '',
		[`${prefix}border-style`]: 'none',
		[`${prefix}border-top-width`]: 0,
		[`${prefix}border-right-width`]: 0,
		[`${prefix}border-bottom-width`]: 0,
		[`${prefix}border-left-width`]: 0,
		[`${prefix}border-sync-width`]: true,
		[`${prefix}border-unit-width`]: 'px',
	};
	return response;
};

export const borderSolid = prefix => {
	let response = {};
	response = {
		[`${prefix}border-color`]: '',
		[`${prefix}border-style`]: 'solid',
		[`${prefix}border-top-width`]: 2,
		[`${prefix}border-right-width`]: 2,
		[`${prefix}border-bottom-width`]: 2,
		[`${prefix}border-left-width`]: 2,
		[`${prefix}border-sync-width`]: true,
		[`${prefix}border-unit-width`]: 'px',
	};
	return response;
};

export const borderDashed = prefix => {
	let response = {};
	response = {
		[`${prefix}border-color`]: '',
		[`${prefix}border-style`]: 'dashed',
		[`${prefix}border-top-width`]: 2,
		[`${prefix}border-right-width`]: 2,
		[`${prefix}border-bottom-width`]: 2,
		[`${prefix}border-left-width`]: 2,
		[`${prefix}border-sync-width`]: true,
		[`${prefix}border-unit-width`]: 'px',
	};
	return response;
};

export const borderDotted = prefix => {
	let response = {};
	response = {
		[`${prefix}border-color`]: '',
		[`${prefix}border-style`]: 'dotted',
		[`${prefix}border-top-width`]: 2,
		[`${prefix}border-right-width`]: 2,
		[`${prefix}border-bottom-width`]: 2,
		[`${prefix}border-left-width`]: 2,
		[`${prefix}border-sync-width`]: true,
		[`${prefix}border-unit-width`]: 'px',
	};
	return response;
};
