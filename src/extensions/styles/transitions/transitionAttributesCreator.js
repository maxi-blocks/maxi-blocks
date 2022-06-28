import createTransitionObj from './createTransitionObj';
import transitionDefault from './transitionDefault';

const getHoverProp = (property, prefix = '') => {
	switch (property) {
		case 'background':
			return prefix
				? `${prefix}background-hover-status`
				: 'block-background-hover-status';
		case 'typography':
			return 'typography-status-hover';
		default:
			return `${prefix}${
				Array.isArray(property) ? property[0] : property
			}-status-hover`;
	}
};

const transitionAttributesCreator = (transitionObj = transitionDefault) => {
	const getTransitionOptions = transitionObj =>
		transitionObj
			? Object.values(transitionObj).map(
					({ title, property, prefix, ignoreHoverProp = false }) => {
						return {
							title,
							property,
							prefix,
							ignoreHoverProp,
						};
					}
			  )
			: null;

	const blockOptions = getTransitionOptions(transitionObj?.block);
	const canvasOptions = getTransitionOptions(transitionObj?.canvas);

	const transitionRawObj = createTransitionObj();

	const transitionStyleObj = {
		block: {},
		canvas: {},
	};

	const createTransitionStyleObjForType = (type, options) =>
		options &&
		options.forEach(({ title, property, prefix, ignoreHoverProp }) => {
			transitionStyleObj[type] = {
				...transitionStyleObj[type],
				[title.toLowerCase()]: {
					...transitionRawObj,
					...(!ignoreHoverProp && {
						hoverProp: getHoverProp(property, prefix),
					}),
				},
			};
		});

	createTransitionStyleObjForType('block', blockOptions);
	createTransitionStyleObjForType('canvas', canvasOptions);

	return {
		transition: {
			type: 'object',
			default: transitionStyleObj,
		},
	};
};

export default transitionAttributesCreator;
