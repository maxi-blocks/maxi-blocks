import breakpointAttributesCreator from '../breakpointAttributesCreator';
import transitionDefault from './transitionDefault';

const getHoverProp = (property, prefix = '') => {
	const hoverProp =
		property === 'background'
			? prefix
				? 'background-hover-status'
				: 'block-background-hover-status'
			: `${property}-status-hover`;

	return `${prefix}${hoverProp}`;
};

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
			? Object.values(transitionObj).map(
					({ title, property, prefix }) => {
						console.log(property);
						return {
							title,
							property,
							prefix,
						};
					}
			  )
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
		blockOptions.forEach(({ title, property, prefix }) => {
			transitionStyleObj.block = {
				...transitionStyleObj.block,
				[title.toLowerCase()]: {
					...transitionRawObj,
					hoverProp: getHoverProp(property, prefix),
				},
			};
		});

	canvasOptions &&
		canvasOptions.forEach(({ title, property, prefix }) => {
			transitionStyleObj.canvas = {
				...transitionStyleObj.canvas,
				[title.toLowerCase()]: {
					...transitionRawObj,
					hoverProp: getHoverProp(property, prefix),
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
