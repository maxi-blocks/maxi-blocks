import { isEmpty, isNil } from 'lodash';

const { select } = wp.data;

const getStyleCardAttr = (
	attribute = null,
	style = 'light',
	defaultAtt = false
) => {
	const styleCards = select('maxiBlocks/style-cards').receiveMaxiStyleCards();

	// console.log('styleCards: ' + styleCards);

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
		const styleCardsArr = Object.keys(getStyleCards()).map(key => {
			if (getStyleCards()[key].status === 'active') {
				if (!defaultAtt) {
					const styleCardsArrToCheck = getStyleCards()[key].styleCard[
						style
					][attribute];
					if (!isNil(styleCardsArrToCheck)) return styleCardsArrToCheck;
					const styleCardsDefaultArrToCheck = getStyleCards()[key]
						.styleCardDefaults[style][attribute];
					if (!isNil(styleCardsDefaultArrToCheck))
						return styleCardsDefaultArrToCheck;
					return false;
				}
				const styleCardsDefaultArrToCheck = getStyleCards()[key]
					.styleCardDefaults[style][attribute];
				if (!isNil(styleCardsDefaultArrToCheck)) return styleCardsDefaultArrToCheck;
				return false;
			}
		});

		return styleCardsArr.toString();
	}
	return false;
};

export default getStyleCardAttr;
