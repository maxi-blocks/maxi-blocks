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
const getTransformTransitionData = (selectors, attributes) => {
	const transformTransition = {};

	if (!isEmpty(selectors)) {
		const transformSelectors = getTransformSelectors(selectors, attributes);

		Object.entries(transformSelectors).forEach(
			([selector, selectorData]) => {
				if (!selectorData?.n) return;

				transformTransition[selector] = {
					ti: capitalize(selectorData.n.label),
					ta: selectorData.n.target,
					p: ['transform', 'transform-origin'],
					it: true,
				};
			}
		);
	}

	return transformTransition;
};

export default getTransformTransitionData;
