import { getBlockNameFromUniqueID } from './utils';
import getTransitionData from '../transitions/getTransitionData';
import transitionAttributesCreator from '../transitions/transitionAttributesCreator';

const isEligible = blockAttributes => {
	const { uniqueID, transition } = blockAttributes;
	const blockName = getBlockNameFromUniqueID(uniqueID);

	const blockDataTransition = getTransitionData(blockName);

	if (!blockDataTransition) return true;

	return (
		Object.keys(blockDataTransition.block) === Object.keys(transition.block)
	);
};

const migrate = ({ newAttributes }) => {
	const {
		uniqueID,
		transition,
		'transition-change-all': transitionChangeAll,
	} = newAttributes;
	const blockName = getBlockNameFromUniqueID(uniqueID);
	const blockDataTransition = getTransitionData(blockName);

	if (!blockDataTransition) return newAttributes;

	const defaultAttributes =
		transitionAttributesCreator(blockDataTransition).transition.default
			.block;

	Object.keys(blockDataTransition.block).forEach(transitionName => {
		if (!transition.block[transitionName]) {
			transition.block[transitionName] = transitionChangeAll
				? Object.values(transition.block)[0]
				: defaultAttributes[transitionName];
		}
	});

	return newAttributes;
};

export default { isEligible, migrate };
