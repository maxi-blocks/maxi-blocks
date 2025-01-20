/**
 * Internal dependencies
 */
import { getIBDataItem } from './utils';

/**
 * External dependencies
 */
import { isObject } from 'lodash';

// Constants
const NAME = 'IB label to ID';

// Pre-compile check functions for better performance
const isRelationEligible = relation =>
	isObject(relation) &&
	'settings' in relation &&
	!('sid' in relation);

const isEligible = blockAttributes => {
	const { relations } = blockAttributes;
	if (!relations) return false;

	// Use for...of for better performance with break capability
	for (const relation of relations) {
		if (isRelationEligible(relation)) return true;
	}
	return false;
};

const migrate = newAttributes => {
	const { relations } = newAttributes;
	if (!relations) return newAttributes;

	// Use for...of for better performance
	for (const relation of relations) {
		if (!isRelationEligible(relation)) continue;

		const dataItem = getIBDataItem(relation);
		if (!dataItem?.sid) continue;

		// Direct property mutations for better performance
		relation.sid = dataItem.sid;
		delete relation.settings;
	}

	return newAttributes;
};

export default { name: NAME, isEligible, migrate };
