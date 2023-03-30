/**
 * This migrator is used to ensure transition objects are complete
 */

import breakpointAttributesCreator from '../../attributes/breakpointAttributesCreator';
import { getBlockNameFromUniqueID } from './utils';
import { getBlockData } from '../../attributes';
import getTransformTransitionData from '../../attributes/transitions/getTransformTransitionData';
import transitionDefault from '../../attributes/transitions/transitionDefault';

import { isNil } from 'lodash';
import getDefaultAttribute from '../../attributes/getDefaultAttribute';
import createTransitionObj from '../../attributes/transitions/createTransitionObj';

const name = 'Transition migrator';

const attributes = breakpointAttributesCreator({
	obj: {
		'transform-scale': {},
		'transform-translate-unit': {},
		'transform-translate': {},
		'transform-rotate': {},
		'transform-rotate-z': {},
		'transform-origin': {},
		'transform-origin-unit': {},
	},
});

const isEligible = blockAttributes => {
	const { transition } = blockAttributes;

	if (isNil(transition)) return false;

	const hasTransform = Object.keys(blockAttributes).some(
		key => key in attributes
	);

	if (!hasTransform) return false;

	const blockName = getBlockNameFromUniqueID(blockAttributes.uniqueID);

	const data = getBlockData(blockName);

	const selectors = data?.customCss?.selectors;

	const transitionSelectors = {
		...(transition || transitionDefault),
		transform: getTransformTransitionData(selectors, blockAttributes),
	};

	const hasAllTransitionSelectors = Object.keys(transitionSelectors).every(
		selector => selector in transition
	);

	if (!hasAllTransitionSelectors) return true;

	return false;
};

const migrate = newAttributes => {
	const { transition } = newAttributes;

	const blockName = getBlockNameFromUniqueID(newAttributes.uniqueID);

	const data = getBlockData(blockName);

	const selectors = data?.customCss?.selectors;

	const transitionSelectors = {
		...(transition || transitionDefault),
		transform: getTransformTransitionData(selectors, newAttributes),
	};

	Object.keys(transitionSelectors).forEach(selector => {
		if (!(selector in transition)) {
			newAttributes.transition[selector] = transitionSelectors[selector];

			Object.keys(transitionSelectors[selector]).forEach(key => {
				if (key in newAttributes.transition[selector])
					newAttributes.transition[selector][key] =
						getDefaultAttribute('_t')?.[selector]?.[key] ||
						createTransitionObj();
			});
		}
	});

	return newAttributes;
};

export default { name, isEligible, migrate };
