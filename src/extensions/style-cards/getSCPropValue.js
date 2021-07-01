/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty, has } from 'lodash';

const getSCPropValue = (target, blockStyle, SCEntry) => {
	const selectedSC =
		select('maxiBlocks/style-cards').receiveMaxiSelectedStyleCard().value ||
		{};
	const selectedSCStyleCard = selectedSC?.[blockStyle]?.styleCard;

	return !isEmpty(selectedSCStyleCard) &&
		has(selectedSCStyleCard[SCEntry], target)
		? selectedSCStyleCard[SCEntry][target]
		: false;
};

export default getSCPropValue;
