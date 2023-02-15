/**
 * Internal dependencies
 */
import createTransitionObj from './createTransitionObj';
import transitionDefault from './transitionDefault';
import getTransformTransition from './getTransformTransition';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const transitionAttributesCreator = ({
	transition = transitionDefault,
	selectors,
}) => {
	const getTransitionOptions = transitionObj =>
		transitionObj ? Object.values(transitionObj) : null;

	if (!isEmpty(selectors))
		transition.canvas = {
			...transition.canvas,
			...getTransformTransition(selectors),
		};

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
