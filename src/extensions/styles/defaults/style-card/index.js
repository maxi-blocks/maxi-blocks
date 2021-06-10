/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty, isNil } from 'lodash';

const getStyleCardAttr = (
	attribute = null,
	SCStyle = 'light',
	defaultAtt = false
) => {
	const activeStyleCard = select(
		'maxiBlocks/style-cards'
	).receiveMaxiActiveStyleCard();

	if (!isNil(activeStyleCard) && !isEmpty(activeStyleCard)) {
		let activeStyleCardFiltered;

		Object.keys(activeStyleCard).forEach(function removeFalse(key) {
			if (activeStyleCard[key]) {
				activeStyleCardFiltered = activeStyleCard[key];
			}
		});

		if (!isNil(activeStyleCardFiltered)) {
			if (!defaultAtt) {
				const styleCardsArrToCheck =
					activeStyleCardFiltered[SCStyle].styleCard[attribute];
				if (!isNil(styleCardsArrToCheck)) return styleCardsArrToCheck;
				const styleCardsDefaultArrToCheck =
					activeStyleCardFiltered[SCStyle].defaultStyleCard[
						attribute
					];
				if (!isNil(styleCardsDefaultArrToCheck))
					return styleCardsDefaultArrToCheck;
				return false;
			}
			const styleCardsDefaultArrToCheck =
				activeStyleCardFiltered[SCStyle].defaultStyleCard[attribute];

			if (!isNil(styleCardsDefaultArrToCheck)) {
				if (styleCardsDefaultArrToCheck.includes('var')) {
					const styleCardsDefaultArrVar =
						styleCardsDefaultArrToCheck.match(/color-\d/);
					const styleCardsDefaultArrVarColor =
						activeStyleCardFiltered[SCStyle].defaultStyleCard[
							styleCardsDefaultArrVar
						];
					if (!isNil(styleCardsDefaultArrVarColor))
						return styleCardsDefaultArrVarColor;
				} else return styleCardsDefaultArrToCheck;
			}

			return false;
		}
		return false;
	}
	return false;
};

export default getStyleCardAttr;
