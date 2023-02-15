/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * @param {Readonly<Object>} selectors custom css selectors
 * @returns {Object} transform transition
 */
const getTransformTransition = selectors => {
	const transformTransition = {};

	if (!isEmpty(selectors))
		Object.values(selectors).forEach(selectorData => {
			transformTransition[`transform ${selectorData.normal.label}`] = {
				title: `Transform ${selectorData.normal.label}`,
				target: selectorData.normal.target,
				property: 'transform',
				isTransform: true,
			};
		});

	return transformTransition;
};

export default getTransformTransition;
