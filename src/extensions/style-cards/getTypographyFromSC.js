/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '@extensions/styles/getLastBreakpointAttribute';

/**
 * External dependencies
 */
import { isEmpty, isNil, merge, omit } from 'lodash';

const getTypographyFromSC = (styleCard, type) => {
	const { receiveMaxiSelectedStyleCard } = select('maxiBlocks/style-cards');

	const selectedSC = styleCard || receiveMaxiSelectedStyleCard().value;

	if (isNil(selectedSC) || isEmpty(selectedSC)) return {};

	const SC = {
		...merge(
			{
				// Ensure `undefined` valued entries on styleCard are not merged/overwritten from defaultStyleCard
				...omit(
					selectedSC.defaultStyleCard[type],
					selectedSC.styleCard?.[type]
						? Object.keys(selectedSC.styleCard?.[type]).filter(
								key => {
									if (!isNil(selectedSC.styleCard[type][key]))
										return false;

									return true;
								}
						  )
						: []
				),
			},
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
