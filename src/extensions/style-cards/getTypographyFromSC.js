/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getLastBreakpointAttribute } from '../styles';

/**
 * External dependencies
 */
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

	if (type !== 'button') return SC;

	const { receiveMaxiDeviceType } = select('maxiBlocks');

	const breakpoint = receiveMaxiDeviceType();

	if (!isEmpty(SC[`font-family-${breakpoint}`])) return SC;

	const pObj = getTypographyFromSC(selectedSC, 'p');
	const fontFamily = getLastBreakpointAttribute({
		target: 'font-family',
		breakpoint,
		attributes: pObj,
	});

	return {
		...SC,
		[`font-family-${breakpoint}`]: fontFamily,
	};
};

export default getTypographyFromSC;
