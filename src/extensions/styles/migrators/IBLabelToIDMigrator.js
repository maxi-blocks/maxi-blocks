/**
 * Internal dependencies
 */
import { getIBDataItem } from './utils';

/**
 * External dependencies
 */
import { isObject } from 'lodash';

const name = 'IB label to ID';

const isRelationEligible = relation =>
	isObject(relation) && 'settings' in relation && !('sid' in relation);

const isEligible = blockAttributes =>
	!!blockAttributes?.relations &&
	blockAttributes.relations.some(isRelationEligible);

const migrate = newAttributes => {
	const { relations } = newAttributes;

	relations.forEach(relation => {
		if (!isRelationEligible(relation)) return;

		const dataItem = getIBDataItem(relation);

		if (!dataItem || !dataItem?.sid) return;

		relation.sid = dataItem.sid;
		delete relation.settings;
	});

	return { ...newAttributes, relations };
};

export default { name, isEligible, migrate };
