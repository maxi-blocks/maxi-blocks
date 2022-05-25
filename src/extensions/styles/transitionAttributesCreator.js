import breakpointAttributesCreator from './breakpointAttributesCreator';
import transitionDefault from './transitions/transitionDefault';

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

const transitionAttributesCreator = (transitionObj = transitionDefault) => {
	const getTransitionOptions = transitionObj =>
		transitionObj
			? Object.values(transitionObj).map(({ title }) => title)
			: null;

	const blockOptions = getTransitionOptions(transitionObj?.block);
	const canvasOptions = getTransitionOptions(transitionObj?.canvas);

	const transitionRawObj = Object.keys(transitionRaw).reduce((acc, key) => {
		acc[key] = transitionRaw[key].default;
		return acc;
	}, {});

	const transitionStyleObj = {
		block: {},
		canvas: {},
	};

	blockOptions &&
		blockOptions.forEach(target => {
			transitionStyleObj.block = {
				...transitionStyleObj.block,
				[target.toLowerCase()]: {
					...transitionRawObj,
				},
			};
		});

	canvasOptions &&
		canvasOptions.forEach(target => {
			transitionStyleObj.canvas = {
				...transitionStyleObj.canvas,
				[target.toLowerCase()]: {
					...transitionRawObj,
				},
			};
		});

	return {
		transition: {
			type: 'object',
			default: transitionStyleObj,
		},
	};
};

export default transitionAttributesCreator;
