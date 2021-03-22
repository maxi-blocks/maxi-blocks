import { isEmpty, isNil } from 'lodash';

const { select } = wp.data;

const getStyleCardAttr = (
	attribute = null,
	style = 'light',
	defaultAtt = false
) => {
	const styleCards = select('maxiBlocks/style-cards').receiveMaxiStyleCards();

	const getStyleCards = () => {
		switch (typeof styleCards) {
			case 'string':
				if (!isEmpty(styleCards)) return JSON.parse(styleCards);
				return false;
			case 'object':
				return styleCards;
			case 'undefined':
				return false;
			default:
				return false;
		}
	};

	if (typeof getStyleCards() === 'object') {
		const activeStyleCard = Object.keys(getStyleCards()).map(key => {
			let activeSC;
			if (getStyleCards()[key].status === 'active') {
				activeSC = getStyleCards()[key];
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
				if (!isNil(styleCardsDefaultArrToCheck))
					return styleCardsDefaultArrToCheck;
				return false;
			}
			return false;
		}
		return false;
	}
	return false;
};

export default getStyleCardAttr;
