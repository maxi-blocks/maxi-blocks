/**
 * This migrator is used to ensure transition objects are complete
 */

import breakpointAttributesCreator from '../breakpointAttributesCreator';
import { getBlockNameFromUniqueID } from './utils';
import { getBlockData } from '../../attributes';
import getTransformTransitionData from '../transitions/getTransformTransitionData';
import transitionDefault from '../transitions/transitionDefault';

import { isNil } from 'lodash';
import getDefaultAttribute from '../getDefaultAttribute';
import createTransitionObj from '../transitions/createTransitionObj';
import transitionAttributesCreator from '../transitions/transitionAttributesCreator';

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

	// Check if all selector exist on transition object
	const hasAllTransitionSelectors = Object.keys(transitionSelectors).every(
		selector => selector in transition
	);

	if (!hasAllTransitionSelectors) return true;

	const defaultTransitionByBlock = data?.transition;

	// Check if all transition keys exist on each transition selector object
	const allSelectorHasAllTransitions = Object.entries(
		defaultTransitionByBlock
	).every(([selector, defaultTransition]) => {
		const hasAllTransitions = Object.keys(defaultTransition).every(
			key => key in transition[selector]
		);

		return hasAllTransitions;
	});

	if (!allSelectorHasAllTransitions) return true;

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
						getDefaultAttribute('transition')?.[selector]?.[key] ||
						createTransitionObj();
			});
		}
	});

	// Includes the missing transition keys on each transition selector object
	const defaultTransitions = transitionAttributesCreator({
		transition: data?.transition,
		selectors: data?.customCss.selectors,
	}).transition.default;

	Object.entries(defaultTransitions).forEach(
		([selector, defaultTransition]) => {
			Object.keys(defaultTransition).forEach(key => {
				if (!(key in transition[selector]))
					newAttributes.transition[selector][key] =
						defaultTransitions[selector][key];
			});
		}
	);

	return newAttributes;
};

export default { name, isEligible, migrate };
