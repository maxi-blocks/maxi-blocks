/**
 * Internal dependencies
 */
import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';
import { getBlockData, getBlockNameFromUniqueID } from '@extensions/attributes';
import transitionAttributesCreator from '@extensions/styles/transitions/transitionAttributesCreator';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * This migrator is used to ensure transition objects are complete
 */
const name = 'Transition attributes';

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

	const defaultTransitionByBlock =
		data?.transition ||
		transitionAttributesCreator({ selectors: data?.customCss?.selectors })
			?.transition?.default;

	// Check if all transition keys exist on each transition selector object
	const allSelectorHasAllTransitions = Object.entries(
		defaultTransitionByBlock
	).every(([selector, defaultTransition]) => {
		if (!(selector in transition)) return false;

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

	// Includes the missing transition keys on each transition selector object
	const defaultTransitions = transitionAttributesCreator({
		transition: data?.transition,
		selectors: data?.customCss?.selectors,
	}).transition.default;

	Object.entries(defaultTransitions).forEach(
		([selector, defaultTransition]) => {
			if (!(selector in transition))
				newAttributes.transition[selector] = defaultTransition;
			else
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
