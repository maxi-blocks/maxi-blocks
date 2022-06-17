import breakpointAttributesCreator from '../breakpointAttributesCreator';

// AFTER #3265 WILL BE RECEIVED FROM THE STORE
const disableDefaultTransition = false;

const transitionRaw = breakpointAttributesCreator({
	obj: {
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
		'transition-status': {
			type: 'boolean',
			default: !disableDefaultTransition,
		},
	},
});

const createTransitionObj = (disableTransitionStatus = false) =>
	Object.keys(transitionRaw).reduce((acc, key) => {
		if (disableTransitionStatus && key.includes('transition-status'))
			return acc;

		acc[key] = transitionRaw[key].default;
		return acc;
	}, {});

export default createTransitionObj;
