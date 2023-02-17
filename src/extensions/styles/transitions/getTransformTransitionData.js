/**
 * Internal dependencies
 */
import { getTransformSelectors } from '../../../components/transform-control/utils';

/**
 * External dependencies
 */
import { isEmpty, capitalize } from 'lodash';

/**
 * @param {Readonly<Object>} selectors custom css selectors
 * @returns {Object} transform transition
 */
const getTransformTransitionData = selectors => {
	const transformTransition = {};

	if (!isEmpty(selectors)) {
		const transformSelectors = getTransformSelectors(selectors);

		Object.values(transformSelectors).forEach(selectorData => {
			transformTransition[selectorData.normal.label] = {
				title: capitalize(selectorData.normal.label),
				target: selectorData.normal.target,
				property: 'transform',
				isTransform: true,
			};
		});
	}

	return transformTransition;
};

export default getTransformTransitionData;
