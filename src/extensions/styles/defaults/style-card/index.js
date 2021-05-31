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
	style = 'light',
	defaultAtt = false
) => {
	const styleCards = select('maxiBlocks/style-cards').receiveMaxiStyleCards();

	if (typeof styleCards === 'object') {
		const activeStyleCard = Object.keys(styleCards).map(key => {
			let activeSC;
			if (styleCards[key].status === 'active') {
				activeSC = styleCards[key];
			}

			if (!isNil(activeSC)) return activeSC;
			return false;
		});

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
						activeStyleCardFiltered.styleCard[style][attribute];
					if (!isNil(styleCardsArrToCheck))
						return styleCardsArrToCheck;
					const styleCardsDefaultArrToCheck =
						activeStyleCardFiltered.styleCardDefaults[style][
							attribute
						];
					if (!isNil(styleCardsDefaultArrToCheck))
						return styleCardsDefaultArrToCheck;
					return false;
				}
				const styleCardsDefaultArrToCheck =
					activeStyleCardFiltered.styleCardDefaults[style][attribute];

				if (!isNil(styleCardsDefaultArrToCheck)) {
					if (styleCardsDefaultArrToCheck.includes('var')) {
						const styleCardsDefaultArrVar =
							styleCardsDefaultArrToCheck.match(/color-\d/);
						const styleCardsDefaultArrVarColor =
							activeStyleCardFiltered.styleCardDefaults[style][
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
	}
	return false;
};

export default getStyleCardAttr;
