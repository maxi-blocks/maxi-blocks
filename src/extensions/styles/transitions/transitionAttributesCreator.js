import createTransitionObj from './createTransitionObj';
import transitionDefault from './transitionDefault';

const transitionAttributesCreator = (transitionObj = transitionDefault) => {
	const getTransitionOptions = transitionObj =>
		transitionObj ? Object.values(transitionObj) : null;

	const transitionRawObj = createTransitionObj();

	const transitionStyleObj = {};

	const createTransitionStyleObjForType = (type, options) =>
		options &&
		options.forEach(({ title }) => {
			transitionStyleObj[type] = {
				...transitionStyleObj[type],
				[title.toLowerCase()]: {
					...transitionRawObj,
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
