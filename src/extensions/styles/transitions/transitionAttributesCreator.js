import createTransitionObj from './createTransitionObj';
import transitionDefault from './transitionDefault';

const getHoverProp = (property, prefix = '') => {
	switch (property) {
		case 'background':
			return prefix
				? `${prefix}background-hover-status`
				: 'block-background-hover-status';
		case 'typography':
			return `${prefix}typography-status-hover`;
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

	const transitionRawObj = createTransitionObj();

	const transitionStyleObj = {};

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

	Object.keys(transitionObj).forEach(type => {
		transitionStyleObj[type] = {};

		const options = getTransitionOptions(transitionObj[type]);
		createTransitionStyleObjForType(type, options);
	});

	const createTransitionSelectedAttributes = transitionObj =>
		Object.keys(transitionObj).reduce((acc, type) => {
			acc[`transition-${type}-selected`] = {
				type: 'string',
				default: 'none',
			};

			return acc;
		}, {});

	return {
		transition: {
			type: 'object',
			default: transitionStyleObj,
		},
		...createTransitionSelectedAttributes(transitionObj),
	};
};

export default transitionAttributesCreator;
