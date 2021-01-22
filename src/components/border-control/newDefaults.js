export const borderNone = prefix => {
	let response = {};
	response = {
		[`${prefix ? prefix : ''}border-color`]: '#fff',
		[`${prefix ? prefix : ''}border-style`]: 'none',
		[`${prefix ? prefix : ''}border-top-width`]: '',
		[`${prefix ? prefix : ''}border-right-width`]: '',
		[`${prefix ? prefix : ''}border-bottom-width`]: '',
		[`${prefix ? prefix : ''}border-left-width`]: '',
		[`${prefix ? prefix : ''}border-sync-width`]: true,
		[`${prefix ? prefix : ''}border-unit-width`]: 'px',
	};
	return response;
};

export const borderSolid = prefix => {
	let response = {};
	response = {
		[`${prefix ? prefix : ''}border-color`]: '#000',
		[`${prefix ? prefix : ''}border-style`]: 'solid',
		[`${prefix ? prefix : ''}border-top-width`]: 2,
		[`${prefix ? prefix : ''}border-right-width`]: 2,
		[`${prefix ? prefix : ''}border-bottom-width`]: 2,
		[`${prefix ? prefix : ''}border-left-width`]: 2,
		[`${prefix ? prefix : ''}border-sync-width`]: true,
		[`${prefix ? prefix : ''}border-unit-width`]: 'px',
	};
	return response;
};

export const borderDashed = prefix => {
	let response = {};
	response = {
		[`${prefix ? prefix : ''}border-color`]: '#000',
		[`${prefix ? prefix : ''}border-style`]: 'dashed',
		[`${prefix ? prefix : ''}border-top-width`]: 2,
		[`${prefix ? prefix : ''}border-right-width`]: 2,
		[`${prefix ? prefix : ''}border-bottom-width`]: 2,
		[`${prefix ? prefix : ''}border-left-width`]: 2,
		[`${prefix ? prefix : ''}border-sync-width`]: true,
		[`${prefix ? prefix : ''}border-unit-width`]: 'px',
	};
	return response;
};

export const borderDotted = prefix => {
	let response = {};
	response = {
		[`${prefix ? prefix : ''}border-color`]: '#000',
		[`${prefix ? prefix : ''}border-style`]: 'dotted',
		[`${prefix ? prefix : ''}border-top-width`]: 2,
		[`${prefix ? prefix : ''}border-right-width`]: 2,
		[`${prefix ? prefix : ''}border-bottom-width`]: 2,
		[`${prefix ? prefix : ''}border-left-width`]: 2,
		[`${prefix ? prefix : ''}border-sync-width`]: true,
		[`${prefix ? prefix : ''}border-unit-width`]: 'px',
	};
	return response;
};
