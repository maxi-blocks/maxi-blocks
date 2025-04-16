/**
 * Internal dependencies
 */
import { getBlockNameFromUniqueID } from '@extensions/attributes';
import getTransitionData from '@extensions/styles/transitions/getTransitionData';
import transitionAttributesCreator from '@extensions/styles/transitions/transitionAttributesCreator';

/**
 * External dependencies
 */
import { isEqual } from 'lodash';

// Constants
const NAME = 'SVG Transition';

// Cache for block data to avoid repeated lookups
const blockDataCache = new Map();

const getBlockData = uniqueID => {
	if (blockDataCache.has(uniqueID)) {
		return blockDataCache.get(uniqueID);
	}
	const blockName = getBlockNameFromUniqueID(uniqueID);
	const data = getTransitionData(blockName);
	blockDataCache.set(uniqueID, data);
	return data;
};

const isEligible = blockAttributes => {
	const { uniqueID, transition } = blockAttributes;

	// Early return for quick fails
	if (!transition || !transition.block) return false;

	const blockDataTransition = getBlockData(uniqueID);
	if (!blockDataTransition || !blockDataTransition.block) return false;

	// Compare sorted keys for accurate comparison
	return !isEqual(
		Object.keys(blockDataTransition.block).sort(),
		Object.keys(transition.block).sort()
	);
};

const migrate = newAttributes => {
	const {
		uniqueID,
		transition,
		'transition-change-all': transitionChangeAll,
	} = newAttributes;

	const blockDataTransition = getBlockData(uniqueID);
	const defaultAttributes = transitionAttributesCreator({
		transition: blockDataTransition,
	}).transition.default.block;

	for (const transitionName of Object.keys(blockDataTransition.block)) {
		if (!transition.block[transitionName]) {
			// Direct property mutation for better performance
			transition.block[transitionName] = transitionChangeAll
				? Object.values(transition.block)[0]
				: defaultAttributes[transitionName];
		}
	}

	return newAttributes;
};

export default { name: NAME, isEligible, migrate };
