/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

// Constants
const NAME = 'IB disable transition for alignment';
const ALIGNMENT_SETTING = 'Alignment';

const isEligible = blockAttributes => {
	const { relations } = blockAttributes;

	// Early return for quick fails
	if (!relations || isEmpty(relations)) return false;

	// Use for...of for better performance with break capability
	for (const relation of relations) {
		if (relation.settings === ALIGNMENT_SETTING &&
			!relation.effects.disableTransition) {
			return true;
		}
	}
	return false;
};

const migrate = newAttributes => {
	const { relations } = newAttributes;
	if (!relations) return newAttributes;

	// Use for...of for better performance
	for (const relation of relations) {
		if (relation.settings === ALIGNMENT_SETTING) {
			relation.effects.disableTransition = true;
		}
	}

	return newAttributes;
};

export default { name: NAME, isEligible, migrate };
