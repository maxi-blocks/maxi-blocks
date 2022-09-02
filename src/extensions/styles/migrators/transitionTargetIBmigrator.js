import relationSettings from '../../../components/relation-control/settings';

const isEligible = blockAttributes =>
	!!blockAttributes?.relations &&
	blockAttributes.relations.some(relation => {
		const blockName = relation.uniqueID.slice(
			0,
			relation.uniqueID.lastIndexOf('-')
		);
		const transitionSetting = relationSettings[
			`maxi-blocks/${blockName}`
		]?.find(transition => transition.label === relation.settings);

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
	const { relations } = newAttributes;

	relations.forEach((relation, i) => {
		const blockName = relation.uniqueID.slice(
			0,
			relation.uniqueID.lastIndexOf('-')
		);
		const transitionSetting = relationSettings[
			`maxi-blocks/${blockName}`
		]?.find(transition => transition.label === relation.settings);

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
