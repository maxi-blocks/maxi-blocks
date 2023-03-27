/**
 * Internal dependencies
 */
import { getIBDataItem } from './utils';

/**
 * External dependencies
 */
import { isEqual } from 'lodash';

const name = 'IB effects';

const settingsToMigrate = [
	{
		key: 'transitionTarget',
		get isEligible() {
			return (transitionSetting, relation) =>
				transitionSetting[this.key] &&
				// `transitionTarget` generates dynamically for transform
				transitionSetting.label !== 'Transform' &&
				!isEqual(
					relation.effects[this.key],
					transitionSetting[this.key]
				);
		},
	},
	{
		key: 'transitionTrigger',
		get isEligible() {
			return (transitionSetting, relation) =>
				transitionSetting[this.key] &&
				!isEqual(
					relation.effects[this.key],
					transitionSetting[this.key]
				);
		},
	},
	{
		key: 'hoverProp',
		attributeKey: 'hoverStatus',
		attributeValue: null,
		get isEligible() {
			return (transitionSetting, relation) =>
				transitionSetting[this.key] &&
				!(this.attributeKey in relation.effects);
		},
	},
];

const isEligible = blockAttributes =>
	!!blockAttributes?.relations &&
	blockAttributes.relations.some(relation => {
		const transitionSetting = getIBDataItem(relation);
		return (
			transitionSetting &&
			settingsToMigrate.some(({ isEligible }) =>
				isEligible(transitionSetting, relation)
			)
		);
	});

const migrate = newAttributes => {
	const { relations } = newAttributes;

	relations.forEach((relation, i) => {
		const transitionSetting = getIBDataItem(relation);

		if (!transitionSetting) return;
		settingsToMigrate.forEach(
			({ key, attributeKey, attributeValue, isEligible }) => {
				if (isEligible(transitionSetting, relation))
					relations[i].effects[attributeKey ?? key] =
						attributeValue ?? transitionSetting[key];
			}
		);
	});

	return { ...newAttributes, relations };
};

export default { name, isEligible, migrate };
