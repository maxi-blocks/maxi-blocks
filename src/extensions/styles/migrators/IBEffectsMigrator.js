/**
 * Internal dependencies
 */
import { getTransitionSetting } from './utils';

const name = 'IB effects';

const keysOfSettingsToMigrate = [
	'transitionTarget',
	'transitionTrigger',
	'hoverProp',
];

const getAttributeKey = key => {
	switch (key) {
		case 'hoverProp':
			return 'hoverStatus';
		default:
			return key;
	}
};

const getAttributeValue = (key, transitionSetting) => {
	switch (key) {
		case 'hoverProp':
			return null;
		default:
			return transitionSetting[key];
	}
};

const isEligibleKey = (key, transitionSetting, relation) =>
	key in transitionSetting && !(getAttributeKey(key) in relation.effects);

const isEligible = blockAttributes =>
	!!blockAttributes?.relations &&
	blockAttributes.relations.some(relation => {
		const transitionSetting = getTransitionSetting(relation);
		return (
			transitionSetting &&
			keysOfSettingsToMigrate.some(key =>
				isEligibleKey(key, transitionSetting, relation)
			)
		);
	});

const migrate = newAttributes => {
	const { relations } = newAttributes;

	relations.forEach((relation, i) => {
		const transitionSetting = getTransitionSetting(relation);

		if (!transitionSetting) return;
		keysOfSettingsToMigrate.forEach(key => {
			if (isEligibleKey(key, transitionSetting, relation))
				relations[i].effects[getAttributeKey(key)] = getAttributeValue(
					key,
					transitionSetting
				);
		});
	});

	return { ...newAttributes, relations };
};

export default { name, isEligible, migrate };
