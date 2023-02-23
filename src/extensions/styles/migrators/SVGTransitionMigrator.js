import { getBlockNameFromUniqueID } from './utils';
import getTransitionData from '../transitions/getTransitionData';
import transitionAttributesCreator from '../transitions/transitionAttributesCreator';
import { isEqual } from 'lodash';

const name = 'SVG Transition Migrator';

const isEligible = blockAttributes => {
	const { uniqueID, transition } = blockAttributes;
	if (!transition) return false;

	const blockName = getBlockNameFromUniqueID(uniqueID);
	const blockDataTransition = getTransitionData(blockName);

	if (!blockDataTransition) return false;

	return !isEqual(
		Object.keys(blockDataTransition.block),
		Object.keys(transition.block)
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
