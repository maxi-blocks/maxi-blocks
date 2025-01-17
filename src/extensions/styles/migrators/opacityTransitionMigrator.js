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

const getBlockData = (uniqueID) => {
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
	const attrs = transitionAttributesCreator().transition.default.canvas.opacity;
	opacityAttributesCache.set('default', attrs);
	return attrs;
};

const isEligible = blockAttributes => {
	const { transition } = blockAttributes;
	if (!transition) return false;

	// Use for...of for better performance with break capability
	for (const category of Object.values(transition)) {
		if (!Object.prototype.hasOwnProperty.call(category, 'opacity')) {
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

	// Use for...of for better performance
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
