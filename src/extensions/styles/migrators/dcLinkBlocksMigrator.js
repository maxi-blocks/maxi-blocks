/**
 * Internal dependencies
 */
import { getBlockNameFromUniqueID } from '@extensions/attributes';
import DC_LINK_BLOCKS from '@components/toolbar/components/link/dcLinkBlocks';

const name = 'DC link blocks';

const versions = ['1.3', '1.3.1', '1.4.1'];

const isEligible = blockAttributes => {
	const {
		'maxi-version-current': maxiVersionCurrent,
		uniqueID,
		'dc-link-status': dcLinkStatus,
		'dc-status': dcStatus,
	} = blockAttributes;

	return (
		versions.includes(maxiVersionCurrent) &&
		DC_LINK_BLOCKS.includes(
			`maxi-blocks/${getBlockNameFromUniqueID(uniqueID)}`
		) &&
		!dcStatus &&
		dcLinkStatus
	);
};

const migrate = newAttributes => {
	newAttributes['dc-status'] = true;
	return newAttributes;
};

export default { name, isEligible, migrate };
