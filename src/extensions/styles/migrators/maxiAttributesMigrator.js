/**
 * Internal dependencies
 */
import { getBlockData, getBlockNameFromUniqueID } from '@extensions/attributes';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const name = 'maxiAttributes Migrator';

const maxiVersions = [
	'0.1',
	'0.0.1 SC1',
	'0.0.1-SC1',
	'0.0.1-SC2',
	'0.0.1-SC3',
];

const isEligible = blockAttributes => {
	const {
		uniqueID,
		'maxi-version-origin': maxiVersionOrigin,
		'maxi-version-current': maxiVersionCurrent,
	} = blockAttributes;

	const blockName = getBlockNameFromUniqueID(uniqueID);
	const blockData = getBlockData(blockName);

	if (
		'maxiAttributes' in blockData &&
		(maxiVersions.includes(maxiVersionCurrent) || !maxiVersionOrigin)
	)
		return true;

	return false;
};

const migrate = newAttributes => {
	const { uniqueID } = newAttributes;

	const blockName = getBlockNameFromUniqueID(uniqueID);
	const blockData = getBlockData(blockName);
	const { maxiAttributes } = blockData;

	const newMaxiAttributes = {};

	Object.entries(maxiAttributes).forEach(([key, value]) => {
		if (isNil(newAttributes[key])) newMaxiAttributes[key] = value;
	});

	return { ...newAttributes, ...newMaxiAttributes };
};

export default { name, isEligible, migrate };
