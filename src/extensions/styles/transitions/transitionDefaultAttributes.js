import breakpointAttributesCreator from '../breakpointAttributesCreator';

const createTransitionDefaultObj = obj => {
	const newObj = breakpointAttributesCreator({ obj });

	const defaults = Object.keys(newObj).reduce((acc, key) => {
		acc[key] = newObj[key].default;

		return acc;
	}, {});

	return defaults;
};

export const defaultTransitionObj = createTransitionDefaultObj({
	'transition-duration': {
		type: 'number',
		default: 0.3,
	},
	'transition-delay': {
		type: 'number',
		default: 0,
	},
	easing: {
		type: 'string',
		default: 'ease',
	},
});

export const disableDefaultTransitionObj = createTransitionDefaultObj({
	'transition-duration': {
		type: 'number',
		default: 0,
	},
	'transition-delay': {
		type: 'number',
		default: 0,
	},
	easing: {
		type: 'string',
		default: 'ease',
	},
});
