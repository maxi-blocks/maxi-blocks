/**
 * Internal dependencies
 */
import { getTransitionSetting } from './utils';

const isEligible = blockAttributes =>
	!!blockAttributes?.relations &&
	blockAttributes.relations.some(relation => {
		const transitionSetting = getTransitionSetting(relation);

		if (
			transitionSetting &&
			transitionSetting.transitionTarget &&
			relation.effects.transitionTarget !==
				transitionSetting.transitionTarget
		)
			return true;

		return false;
	});

const migrate = ({ newAttributes }) => {
	if (!isEligible(newAttributes)) return newAttributes;

	const { relations } = newAttributes;

	relations.forEach((relation, i) => {
		const transitionSetting = getTransitionSetting(relation);

		if (
			transitionSetting &&
			transitionSetting.transitionTarget &&
			relation.effects.transitionTarget !==
				transitionSetting.transitionTarget
		)
			relations[i].effects.transitionTarget =
				transitionSetting.transitionTarget;
	});

	return { ...newAttributes, relations };
};

export default { isEligible, migrate };
