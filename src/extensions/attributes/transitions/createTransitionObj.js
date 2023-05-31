import breakpointAttributesCreator from '../breakpointAttributesCreator';

// AFTER #3265 WILL BE RECEIVED FROM THE STORE
const disableDefaultTransition = false;

const transitionRaw = breakpointAttributesCreator({
	obj: {
		_tdu: {
			type: 'number',
			default: 0.3,
		},
		_tde: {
			type: 'number',
			default: 0,
		},
		_ea: {
			type: 'string',
			default: 'ease',
		},
		_ts: {
			type: 'boolean',
			default: !disableDefaultTransition,
		},
	},
});

const createTransitionObj = () =>
	Object.keys(transitionRaw).reduce((acc, key) => {
		acc[key] = transitionRaw[key].default;
		return acc;
	}, {});

export default createTransitionObj;
