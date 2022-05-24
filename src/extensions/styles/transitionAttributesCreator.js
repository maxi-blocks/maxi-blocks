import breakpointAttributesCreator from './breakpointAttributesCreator';

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
	},
});

const transitionAttributesCreator = ({ blockOptions, canvasOptions }) => {
	const transitionRawObj = Object.keys(transitionRaw).reduce((acc, key) => {
		acc[key] = transitionRaw[key].default;
		return acc;
	}, {});

	const transitionObj = {
		block: {},
		canvas: {},
	};

	blockOptions &&
		blockOptions.forEach(target => {
			transitionObj.block = {
				...transitionObj.block,
				[target.toLowerCase()]: {
					...transitionRawObj,
				},
			};
		});

	canvasOptions &&
		canvasOptions.forEach(target => {
			transitionObj.canvas = {
				...transitionObj.canvas,
				[target.toLowerCase()]: {
					...transitionRawObj,
				},
			};
		});

	return {
		transition: {
			type: 'object',
			default: transitionObj,
		},
	};
};

export default transitionAttributesCreator;
