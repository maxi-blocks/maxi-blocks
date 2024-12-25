import { getBlockNameFromUniqueID } from '@extensions/attributes';
import getTransitionData from '@extensions/styles/transitions/getTransitionData';
import transitionAttributesCreator from '@extensions/styles/transitions/transitionAttributesCreator';
import { isEqual } from 'lodash';

const name = 'SVG Transition Migrator';

const isEligible = blockAttributes => {
	const { uniqueID, transition } = blockAttributes;
	if (!transition) return false;

	const blockName = getBlockNameFromUniqueID(uniqueID);
	const blockDataTransition = getTransitionData(blockName);

	if (!blockDataTransition) return false;

	return !isEqual(
		Object.keys(blockDataTransition.block).sort(),
		Object.keys(transition.block).sort()
	);
};

const migrate = newAttributes => {
	const { uniqueID, 'transition-change-all': transitionChangeAll } =
		newAttributes;
	const blockName = getBlockNameFromUniqueID(uniqueID);
	const blockDataTransition = getTransitionData(blockName);

	const defaultAttributes = transitionAttributesCreator({
		transition: blockDataTransition,
	}).transition.default.block;

	Object.keys(blockDataTransition.block).forEach(transitionName => {
		if (!newAttributes.transition.block[transitionName]) {
			newAttributes.transition.block[transitionName] = transitionChangeAll
				? Object.values(newAttributes.transition.block)[0]
				: defaultAttributes[transitionName];
		}
	});

	return newAttributes;
};

export default { name, isEligible, migrate };
