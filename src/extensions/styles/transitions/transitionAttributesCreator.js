import breakpointAttributesCreator from '../breakpointAttributesCreator';
import transitionDefault from './transitionDefault';

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
			? Object.values(transitionObj).map(({ title, hoverProp }) => {
					return {
						title,
						hoverProp,
					};
			  })
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
		blockOptions.forEach(({ title, hoverProp }) => {
			transitionStyleObj.block = {
				...transitionStyleObj.block,
				[title.toLowerCase()]: {
					...transitionRawObj,
					hoverProp,
				},
			};
		});

	canvasOptions &&
		canvasOptions.forEach(({ title, hoverProp }) => {
			transitionStyleObj.canvas = {
				...transitionStyleObj.canvas,
				[title.toLowerCase()]: {
					...transitionRawObj,
					hoverProp,
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
