import { isEmpty } from 'lodash';

const { select } = wp.data;

const getStyleCardAttr = (attribute = null, style = 'light', defaultAtt = false) => {
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
		const styleCardsArr = Object.keys(getStyleCards()).map(key => {
			if (!defaultAtt) {
				const styleCardsArrToCheck = getStyleCards()[key].styleCard[
					style
				][attribute];
				if (styleCardsArrToCheck) return styleCardsArrToCheck;

				const styleCardsDefaultArrToCheck = getStyleCards()[key]
					.styleCardDefaults[style][attribute];
				if (styleCardsDefaultArrToCheck)
					return styleCardsDefaultArrToCheck;
				return false;
			}
			const styleCardsDefaultArrToCheck = getStyleCards()[key]
				.styleCardDefaults[style][attribute];
			if (styleCardsDefaultArrToCheck) return styleCardsDefaultArrToCheck;
			return false;
		});

		return styleCardsArr.toString();
	}
	return false;
};

export default getStyleCardAttr;
