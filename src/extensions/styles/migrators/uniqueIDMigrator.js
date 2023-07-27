/**
 * Internal dependencies
 */
import { getBlockNameFromUniqueID, getBlockDataByUniqueID } from './utils';
import uniqueIDGenerator from '../../attributes/uniqueIDGenerator';
import getCustomLabel from '../../maxi-block/getCustomLabel';

/**
 * External dependencies
 */
import { isObject, isArray } from 'lodash';

const name = 'uniqueID';

const isEligible = blockAttributes => !blockAttributes.uniqueID.endsWith('-u');

const isRelationEligible = relation =>
	isObject(relation) &&
	'uniqueID' in relation &&
	!relation.uniqueID.endsWith('-u');

const migrate = newAttributes => {
	const { uniqueID, customLabel } = newAttributes;
	const blockName = getBlockNameFromUniqueID(uniqueID);
	const newUniqueID = uniqueIDGenerator({ blockName });
	const newCustomLabel = getCustomLabel(customLabel, newUniqueID);
	newAttributes.uniqueID = newUniqueID;
	newAttributes.customLabel = newCustomLabel;
	newAttributes.legacyUniqueID = uniqueID;

	return newAttributes;
};

export default { name, isEligible, migrate };
