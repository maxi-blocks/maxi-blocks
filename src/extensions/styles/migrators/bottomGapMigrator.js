/**
 * This migrator is used to mitigate the change did on Typography default attributes where
 * we added the new `bottom-gap` attribute and affects the patterns in the Cloud until the
 * version 0.0.1-SC5.
 */
import { getBlockNameFromUniqueID } from '@extensions/attributes';

// Constants to avoid string allocations and improve lookup speed
const NAME = 'Text bottom gap';
const BLOCK_TYPE = 'text-maxi';
const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
const VALID_VERSIONS = new Set([
	'0.1',
	'0.0.1 SC1',
	'0.0.1-SC1',
	'0.0.1-SC2',
	'0.0.1-SC3',
	'0.0.1-SC4',
]);

const isEligible = blockAttributes => {
	const { uniqueID, 'maxi-version-origin': maxiVersionOrigin } =
		blockAttributes;

	// Early return if not text-maxi block
	if (getBlockNameFromUniqueID(uniqueID) !== BLOCK_TYPE) return false;

	// Run migrator only if:
	// 1. Block has no version (legacy block)
	// 2. OR block was created with a version that needs migration
	return !maxiVersionOrigin || VALID_VERSIONS.has(maxiVersionOrigin);
};

const migrate = newAttributes => {
	let hasBottomGap = false;
	for (let i = 0; i < BREAKPOINTS.length; i += 1) {
		if (newAttributes[`bottom-gap-${BREAKPOINTS[i]}`]) {
			hasBottomGap = true;
			break;
		}
	}

	if (!hasBottomGap) {
		newAttributes['bottom-gap-general'] = 0;
	}

	return newAttributes;
};

export default { name: NAME, isEligible, migrate };
