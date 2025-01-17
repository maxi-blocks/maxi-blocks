/**
 * Internal dependencies
 */
import { getIBDataItem } from './utils';

/**
 * External dependencies
 */
import { isEqual } from 'lodash';

// Constants
const NAME = 'IB effects';

// Pre-define settings array for better performance
const SETTINGS_TO_MIGRATE = Object.freeze([
	{
		key: 'transitionTarget',
		get isEligible() {
			return (transitionSetting, relation) =>
				transitionSetting[this.key] &&
				transitionSetting.label !== 'Transform' &&
				!isEqual(relation.effects[this.key], transitionSetting[this.key]);
		},
	},
	{
		key: 'transitionTrigger',
		get isEligible() {
			return (transitionSetting, relation) =>
				transitionSetting[this.key] &&
				!isEqual(relation.effects[this.key], transitionSetting[this.key]);
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
]);

const isEligible = blockAttributes => {
	const { relations } = blockAttributes;
	if (!relations) return false;

	// Use for...of for better performance with break capability
	for (const relation of relations) {
		if (!relation.migrated) {
			const transitionSetting = getIBDataItem(relation);
			if (!transitionSetting) continue;

			// Use for...of for better performance
			for (const setting of SETTINGS_TO_MIGRATE) {
				if (setting.isEligible(transitionSetting, relation)) {
					return true;
				}
			}
		}
	}
	return false;
};

const migrate = newAttributes => {
	const { relations } = newAttributes;
	if (!relations) return newAttributes;

	// Use for...of for better performance
	for (const relation of relations) {
		const transitionSetting = getIBDataItem(relation);
		if (!transitionSetting) {
			relation.migrated = true;
			continue;
		}

		for (const setting of SETTINGS_TO_MIGRATE) {
			if (setting.isEligible(transitionSetting, relation)) {
				relation.effects[setting.attributeKey ?? setting.key] =
					setting.attributeValue ?? transitionSetting[setting.key];
			}
		}
		relation.migrated = true;
	}

	return newAttributes;
};

export default { name: NAME, isEligible, migrate };
