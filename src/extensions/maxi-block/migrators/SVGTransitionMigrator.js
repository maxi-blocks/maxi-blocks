import { getBlockNameFromUniqueID } from './utils';
import getTransitionData from '../../attributes/transitions/getTransitionData';
import transitionAttributesCreator from '../../attributes/transitions/transitionAttributesCreator';
import { isEqual } from 'lodash';

const name = 'SVG Transition Migrator';

const isEligible = blockAttributes => {
	const { _uid: uniqueID, transition } = blockAttributes;
	if (!transition) return false;

	const blockName = getBlockNameFromUniqueID(uniqueID);
	const blockDataTransition = getTransitionData(blockName);

	if (!blockDataTransition) return false;

	return !isEqual(
		Object.keys(blockDataTransition.block),
		Object.keys(transition.b)
	);
};

const migrate = newAttributes => {
	const { _uid: uniqueID, _tca: transitionChangeAll } = newAttributes;
	const blockName = getBlockNameFromUniqueID(uniqueID);
	const blockDataTransition = getTransitionData(blockName);

	const defaultAttributes = transitionAttributesCreator({
		transition: blockDataTransition,
	}).transition.default.block;

	Object.keys(blockDataTransition.block).forEach(transitionName => {
		if (!newAttributes.transition.b[transitionName]) {
			newAttributes.transition.b[transitionName] = transitionChangeAll
				? Object.values(newAttributes.transition.b)[0]
				: defaultAttributes[transitionName];
		}
	});

	return newAttributes;
};

export default { name, isEligible, migrate };
