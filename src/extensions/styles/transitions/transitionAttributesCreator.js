/**
 * Internal dependencies
 */
import createTransitionObj from './createTransitionObj';
import transitionDefault from './transitionDefault';
import getTransformTransitionData from './getTransformTransitionData';

/**
 * External dependencies
 */
import { cloneDeep, isEmpty } from 'lodash';

const transitionAttributesCreator = ({
	transition = cloneDeep(transitionDefault),
	selectors,
} = {}) => {
	const getTransitionOptions = transitionObj =>
		transitionObj ? Object.values(transitionObj) : null;

	if (!isEmpty(selectors))
		transition.transform = getTransformTransitionData(selectors);

	const transitionRawObj = createTransitionObj();

	const transitionStyleObj = {};

	const createTransitionStyleObjForType = (type, options) =>
		
		options?.forEach(({ title }) => {
			transitionStyleObj[type] = {
				...transitionStyleObj[type],
				[title.toLowerCase()]: {
					...transitionRawObj,
				},
			};
		});

	Object.keys(transition).forEach(type => {
		transitionStyleObj[type] = {};

		const options = getTransitionOptions(transition[type]);
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
		...createTransitionSelectedAttributes(transition),
	};
};

export default transitionAttributesCreator;
