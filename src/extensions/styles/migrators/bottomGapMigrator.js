/**
 * This migrator is used to mitigate the change did on Typography default attributes where
 * we added the new `bottom-gap` attribute and affects the patterns in the Cloud until the
 * version 0.0.1-SC5.
 */
import { getBlockNameFromUniqueID } from '@extensions/attributes';

const name = 'Text bottom gap migrator';

const maxiVersions = [
	'0.1',
	'0.0.1 SC1',
	'0.0.1-SC1',
	'0.0.1-SC2',
	'0.0.1-SC3',
	'0.0.1-SC4',
];

const isEligible = blockAttributes => {
	const {
		uniqueID,
		'maxi-version-origin': maxiVersionOrigin,
		'maxi-version-current': maxiVersionCurrent,
	} = blockAttributes;

	const blockName = getBlockNameFromUniqueID(uniqueID);

	if (
		blockName === 'text-maxi' &&
		(maxiVersions.includes(maxiVersionCurrent) || !maxiVersionOrigin)
	)
		return true;

	return false;
};

const migrate = newAttributes => {
	if (
		!['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'].some(
			breakpoint => !!newAttributes[`bottom-gap-${breakpoint}`]
		)
	)
		newAttributes['bottom-gap-general'] = 0;

	return newAttributes;
};

export default { name, isEligible, migrate };
