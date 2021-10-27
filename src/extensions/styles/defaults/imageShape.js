const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

export const rawImageShape = {
	'image-shape-size': {
		type: 'string',
		default: '',
	},
	'image-shape-scale': {
		type: 'number',
	},
	'image-shape-position': {
		type: 'string',
		default: '',
	},
	'image-shape-rotate': {
		type: 'number',
	},
	'image-shape-flip-x': {
		type: 'boolean',
	},
	'image-shape-flip-y': {
		type: 'boolean',
	},
};

const breakpointObjectCreator = obj => {
	const response = {};

	Object.entries(obj).forEach(([key, val]) => {
		if (['background-layers'].includes(key)) return;

		breakpoints.forEach(breakpoint => {
			const newVal = { ...val };
			if (breakpoint !== 'general') delete newVal.default;

			const newKey = `${key}-${breakpoint}`;

			response[newKey] = newVal;
		});
	});

	return response;
};

export const imageShape = breakpointObjectCreator(rawImageShape);
