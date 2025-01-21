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

// Constants
const NAME = 'Transition attributes';

// Pre-define transform attributes for better performance
const TRANSFORM_ATTRIBUTES = breakpointAttributesCreator({
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

// Cache for block data
const blockDataCache = new Map();

const getBlockDataCached = blockName => {
	if (blockDataCache.has(blockName)) {
		return blockDataCache.get(blockName);
	}
	const data = getBlockData(blockName);
	blockDataCache.set(blockName, data);
	return data;
};

const isEligible = blockAttributes => {
	const { transition, uniqueID } = blockAttributes;

	// Early return for quick fails
	if (isNil(transition)) return false;

	const hasTransform = Object.keys(blockAttributes).some(
		key => key in TRANSFORM_ATTRIBUTES
	);
	if (!hasTransform) return false;

	const blockName = getBlockNameFromUniqueID(uniqueID);
	const data = getBlockDataCached(blockName);

	const defaultTransitionByBlock =
		data?.transition ||
		transitionAttributesCreator({ selectors: data?.customCss?.selectors })
			?.transition?.default;

	// Check if all transition keys exist on each transition selector object
	for (const [selector, defaultTransition] of Object.entries(defaultTransitionByBlock)) {
		if (!(selector in transition)) return true;

		for (const key of Object.keys(defaultTransition)) {
			if (!(key in transition[selector])) return true;
		}
	}

	return false;
};

const migrate = newAttributes => {
	const { transition, uniqueID } = newAttributes;
	if (!transition) return newAttributes;

	const blockName = getBlockNameFromUniqueID(uniqueID);
	const data = getBlockDataCached(blockName);

	// Get default transitions
	const defaultTransitions = transitionAttributesCreator({
		transition: data?.transition,
		selectors: data?.customCss?.selectors,
	}).transition.default;


	for (const [selector, defaultTransition] of Object.entries(defaultTransitions)) {
		if (!(selector in transition)) {
			// Direct property mutation for better performance
			transition[selector] = defaultTransition;
			continue;
		}

		for (const [key, value] of Object.entries(defaultTransition)) {
			if (!(key in transition[selector])) {
				transition[selector][key] = value;
			}
		}
	}

	return newAttributes;
};

export default { name: NAME, isEligible, migrate };
