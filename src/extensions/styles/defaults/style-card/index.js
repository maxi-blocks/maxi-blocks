const { __ } = wp.i18n;
import { isEmpty, forIn } from 'lodash';

const { select } = wp.data;

const getStyleCardAttr = (attributes = null) => {

	const styleCards = select('maxiBlocks/style-cards').receiveMaxiStyleCards();

	const getStyleCards = () => {
		switch (typeof styleCards) {
			case 'string':
				if (!isEmpty(styleCards)) return JSON.parse(styleCards);
				return {};
			case 'object':
				return styleCards;
			case 'undefined':
				return {};
			default:
				return {};
		}
	};

	const getStyleCardsOptions = () => {
		const styleCardsArr = [
			{ label: __('Select Style Card', 'maxi-blocks'), value: '' },
		];

		forIn(getStyleCards(), (value, key) =>
			styleCardsArr.push({ label: value.name, value: key })
		);
		return styleCardsArr;
	};

	return getStyleCards();
};

export default getStyleCardAttr;
