/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { isEmpty, isNil, merge } from 'lodash';

const getTypographyFromSC = (styleCard, type) => {
	const { receiveMaxiSelectedStyleCard } = select('maxiBlocks/style-cards');

	const selectedSC = styleCard || receiveMaxiSelectedStyleCard().value;

	if (isNil(selectedSC) || isEmpty(selectedSC)) return {};

	const SC = {
		...merge(
			{ ...selectedSC.defaultStyleCard[type] },
			{ ...selectedSC.styleCard[type] }
		),
	};

	return SC;
};

export default getTypographyFromSC;
