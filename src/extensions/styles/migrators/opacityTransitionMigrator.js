/**
 * Internal dependencies
 */
import getTransitionData from '@extensions/styles/transitions/getTransitionData';
import transitionAttributesCreator from '@extensions/styles/transitions/transitionAttributesCreator';
import { getBlockNameFromUniqueID } from '@extensions/attributes';

// Constants
const NAME = 'Opacity Transition';

// Cache for block data and transition attributes
const blockDataCache = new Map();
const opacityAttributesCache = new Map();

const getBlockData = uniqueID => {
	if (blockDataCache.has(uniqueID)) {
		return blockDataCache.get(uniqueID);
	}
	const blockName = getBlockNameFromUniqueID(uniqueID);
	const data = getTransitionData(blockName);
	blockDataCache.set(uniqueID, data);
	return data;
};

const getOpacityAttributes = () => {
	if (opacityAttributesCache.has('default')) {
		return opacityAttributesCache.get('default');
	}
	const attrs =
		transitionAttributesCreator().transition.default.canvas.opacity;
	opacityAttributesCache.set('default', attrs);
	return attrs;
};

const isEligible = blockAttributes => {
	const { transition } = blockAttributes;
	if (!transition) return false;

	// Check if any category needs opacity migration
	for (const [categoryName, categoryData] of Object.entries(transition)) {
		const blockDataTransition = getBlockData(blockAttributes.uniqueID);

		// Skip if this category doesn't exist in block data or shouldn't have opacity
		if (
			!blockDataTransition[categoryName] ||
			!blockDataTransition[categoryName].opacity
		) {
			// eslint-disable-next-line no-continue
			continue;
		}

		// If opacity exists but is not properly structured (not an object with properties)
		if (
			categoryData.opacity !== undefined &&
			typeof categoryData.opacity !== 'object'
		) {
			return true;
		}

		// If category should have opacity but doesn't have it at all
		if (!Object.prototype.hasOwnProperty.call(categoryData, 'opacity')) {
			return true;
		}

		// Check if opacity already matches what migration would set
		if (
			typeof categoryData.opacity === 'object' &&
			categoryData.opacity !== null
		) {
			const opacityAttributes = getOpacityAttributes();
			// If opacity exactly matches what migration would set, skip
			const isAlreadyMigrated =
				JSON.stringify(categoryData.opacity) ===
				JSON.stringify(opacityAttributes);
			if (isAlreadyMigrated) {
				// eslint-disable-next-line no-continue
				continue;
			}
			// If opacity exists but doesn't match, needs migration
			return true;
		}
	}
	return false;
};

const migrate = newAttributes => {
	const { uniqueID, transition } = newAttributes;
	if (!transition) return newAttributes;

	const blockDataTransition = getBlockData(uniqueID);
	const opacityAttributes = getOpacityAttributes();

	for (const [category, properties] of Object.entries(blockDataTransition)) {
		for (const name of Object.keys(properties)) {
			if (name === 'opacity') {
				transition[category][name] = opacityAttributes;
			}
		}
	}

	return newAttributes;
};

export default { name: NAME, isEligible, migrate };
