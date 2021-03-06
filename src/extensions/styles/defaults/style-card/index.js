import { isEmpty } from 'lodash';

const { select } = wp.data;

const getStyleCardAttr = (attribute = null, style = 'light') => {
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

	// console.log({getStyleCards} + typeof {getStyleCards});

	if (typeof { getStyleCards } === 'object') {
		//console.log('OBJECT!');
		const styleCardsArr = Object.keys(getStyleCards()).map(key => {
			const styleCardsArrToCheck = getStyleCards()[key].styleCard[style][
				attribute
			];
			if (styleCardsArrToCheck) return styleCardsArrToCheck;
			return false;
		});
		return styleCardsArr;
	}
	return false;
};

export default getStyleCardAttr;
