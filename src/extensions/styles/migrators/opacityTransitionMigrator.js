/**
 * Internal dependencies
 */
import getTransitionData from '../transitions/getTransitionData';
import transitionAttributesCreator from '../transitions/transitionAttributesCreator';
import { getBlockNameFromUniqueID } from '../../attributes';

const name = 'Opacity Transition Migrator';

const isEligible = blockAttributes => {
	const { transition } = blockAttributes;
	if (!transition) return false;

	return Object.values(transition).every(
		category => !Object.keys(category).includes('opacity')
	);
};

const migrate = newAttributes => {
	const { uniqueID } = newAttributes;
	const blockName = getBlockNameFromUniqueID(uniqueID);
	const blockDataTransition = getTransitionData(blockName);

	const opacityAttributes =
		transitionAttributesCreator().transition.default.canvas.opacity;

	Object.entries(blockDataTransition).forEach(([category, properties]) => {
		Object.keys(properties).forEach(name => {
			if (name === 'opacity') {
				newAttributes.transition[category][name] = opacityAttributes;
			}
		});
	});

	return newAttributes;
};

export default { name, isEligible, migrate };
