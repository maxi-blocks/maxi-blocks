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
}) => {
	const getTransitionOptions = transitionObj =>
		transitionObj ? Object.keys(transitionObj) : null;

	if (!isEmpty(selectors))
		transition.tr = getTransformTransitionData(selectors);

	const transitionRawObj = createTransitionObj();

	const transitionStyleObj = {};

	const createTransitionStyleObjForType = (type, options) =>
		options &&
		options.forEach(key => {
			transitionStyleObj[type] = {
				...transitionStyleObj[type],
				[key]: {
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
			acc[`tr-${type}-s`] = {
				type: 'string',
				default: 'none',
			};

			return acc;
		}, {});

	return {
		_t: {
			type: 'object',
			default: transitionStyleObj,
		},
		...createTransitionSelectedAttributes(transition),
	};
};

export default transitionAttributesCreator;
